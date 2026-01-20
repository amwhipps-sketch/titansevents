
import { Fixture, AdminStorage } from '../types';
import { CALENDAR_ID } from '../constants';

const STORAGE_KEY = 'titans_admin_data';

const TITANS_TEAMS = [
  "Titans Development",
  "Titans Two Brewers",
  "Titans LGBT Hero",
  "Titans Wheeler",
  "Titans Turner"
];

export const getAdminData = (): AdminStorage => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return {
      manualAdditions: [],
      manualOverrides: {},
      managedOpponents: [],
      managedTeams: [...TITANS_TEAMS]
    };
  }
  const data = JSON.parse(saved);
  data.manualAdditions = data.manualAdditions.map((f: any) => ({ ...f, date: new Date(f.date) }));
  return data;
};

export const saveAdminData = (data: AdminStorage) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

type ProxyConfig = {
    urlGenerator: (url: string) => string;
    responseType: 'text' | 'json';
};

const PROXIES: ProxyConfig[] = [
  { urlGenerator: (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`, responseType: 'text' },
  { urlGenerator: (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, responseType: 'json' },
  { urlGenerator: (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`, responseType: 'text' }
];

const getIcsUrl = (calendarId: string) => 
  `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`;

const parseIcsDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const match = dateStr.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
  if (!match) {
    const simpleMatch = dateStr.match(/(\d{4})(\d{2})(\d{2})/);
    if (simpleMatch) return new Date(parseInt(simpleMatch[1]), parseInt(simpleMatch[2]) - 1, parseInt(simpleMatch[3]));
    return null;
  }
  const [, year, month, day, hour, minute, second] = match;
  return new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second)));
};

const unfoldLines = (lines: string[]): string[] => {
  const unfolded: string[] = [];
  lines.forEach(line => {
    if (line.startsWith(' ') || line.startsWith('\t')) {
      if (unfolded.length > 0) unfolded[unfolded.length - 1] += line.trim();
    } else unfolded.push(line);
  });
  return unfolded;
};

export const mapEventToFixture = (event: { UID: string, SUMMARY: string, LOCATION?: string, DESCRIPTION?: string }, date: Date): Fixture => {
  let summary = (event.SUMMARY || 'Match').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\[nN]/g, ' ').trim();
  let description = (event.DESCRIPTION || '').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\[nN]/g, ' ');
  let location = (event.LOCATION || 'TBC').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\[nN]/g, ' ');

  let isHome = true;
  let isDerby = false;
  let opponent = "";
  let competition = 'Social'; 
  let competitionTag: string | undefined = undefined;
  let teamName = "Titans";
  let status: 'upcoming' | 'completed' | 'live' = date < new Date() ? 'completed' : 'upcoming';

  const context = (summary + ' ' + description).toLowerCase();

  const fixtureRegex = /^(.*?)(\s+(?:vs\.?|v)\s+|\s+[-–—]\s+)(.*)$/i;
  const matchResult = summary.match(fixtureRegex);
  
  if (matchResult) {
    competition = 'Fixture'; 
    const [, teamA, , teamB] = matchResult;
    const teamALower = teamA.toLowerCase();
    const teamBLower = teamB.toLowerCase();
    
    const isTeamATitans = TITANS_TEAMS.some(t => teamALower.includes(t.toLowerCase())) || teamALower.includes('titans');
    const isTeamBTitans = TITANS_TEAMS.some(t => teamBLower.includes(t.toLowerCase())) || teamBLower.includes('titans');

    if (isTeamATitans && isTeamBTitans) {
      isDerby = true;
      teamName = teamA.trim();
      opponent = teamB.trim();
    } else if (isTeamBTitans) {
      isHome = false;
      teamName = teamB.trim();
      opponent = teamA.trim();
    } else {
      isHome = true;
      teamName = teamA.trim();
      opponent = teamB.trim();
    }
  } else if (context.includes('training')) {
    competition = 'Training';
    teamName = summary;
  } else if (context.includes('tournament')) {
    competition = 'Tournament';
    teamName = summary;
  } else if (context.includes('club event')) {
    competition = 'Club Event';
    teamName = summary;
  } else {
    competition = 'Social';
    teamName = summary;
  }

  // 1. Competition Labels
  if (context.includes('gfsn shield')) { competitionTag = 'GFSN SHIELD'; competition = 'GFSN Shield'; }
  else if (context.includes('gfsn')) { competitionTag = 'GFSN'; competition = 'GFSN League'; }
  else if (context.includes('london unity league') || context.includes('lul')) { competitionTag = 'LUL'; competition = 'London Unity League'; }
  else if (context.includes('london dev league') || context.includes('ldl')) { competitionTag = 'LDL'; competition = 'London Dev League'; }

  // 2. Tournament specific override
  if (context.includes('tournament')) {
      competition = 'Tournament';
  }

  // 3. Metallic Tier Match Stages
  if (context.includes('quarter final') || context.match(/\bqf\b/i)) {
    competitionTag = competitionTag || 'QF';
    if (!competition.toLowerCase().includes('shield')) competition = 'Quarter Final';
  } else if (context.includes('semi final') || context.match(/\bsf\b/i)) {
    competitionTag = competitionTag || 'SF';
    if (!competition.toLowerCase().includes('plate')) competition = 'Semi Final';
  } else if (context.includes('final') && !context.includes('semi') && !context.includes('quarter')) {
    competitionTag = competitionTag || 'FINAL';
    if (!competition.toLowerCase().includes('cup')) competition = 'Final';
  }

  // 4. Score Parsing
  const scoreRegex = /\b(\d+)\s*[-–—]\s*(\d+)\b/; 
  let scoreMatch = description.match(scoreRegex) || summary.match(scoreRegex);
  let score, result;

  if (scoreMatch) {
    status = 'completed';
    score = scoreMatch[0].replace(/\s+/g, '').replace(/[–—]/, '-'); 
    const s1 = parseInt(scoreMatch[1]), s2 = parseInt(scoreMatch[2]);
    const titansScore = isHome ? s1 : s2;
    const oppScore = isHome ? s2 : s1;
    if (titansScore > oppScore) result = 'W';
    else if (titansScore < oppScore) result = 'L';
    else result = 'D';
  }

  return {
    id: event.UID || Math.random().toString(),
    opponent, isHome, date, location, competition, competitionTag,
    status, teamName, score, result: result as any
  };
};

const parseICS = (icsData: string): Fixture[] => {
  if (!icsData.includes("BEGIN:VCALENDAR")) throw new Error("Invalid ICS data");
  const lines = unfoldLines(icsData.split(/\r\n|\n|\r/));
  const fixtures: Fixture[] = [];
  let currentEvent: any = null, inEvent = false;

  for (const line of lines) {
    if (line.startsWith('BEGIN:VEVENT')) { inEvent = true; currentEvent = {}; continue; }
    if (line.startsWith('END:VEVENT')) {
      inEvent = false;
      if (currentEvent?.DTSTART && currentEvent?.SUMMARY) {
        const date = parseIcsDate(currentEvent.DTSTART);
        if (date) fixtures.push(mapEventToFixture(currentEvent, date));
      }
      currentEvent = null;
      continue;
    }
    if (inEvent && currentEvent) {
      const idx = line.indexOf(':');
      if (idx > -1) currentEvent[line.substring(0, idx).split(';')[0]] = line.substring(idx + 1);
    }
  }
  return fixtures;
};

export const getFixtures = async (): Promise<Fixture[]> => {
  const adminData = getAdminData();
  let googleFixtures: Fixture[] = [];
  
  try {
    const icsUrl = getIcsUrl(CALENDAR_ID);
    for (const proxy of PROXIES) {
      try {
        const response = await fetch(proxy.urlGenerator(icsUrl));
        if (!response.ok) continue;
        let data = proxy.responseType === 'json' ? (await response.json()).contents : await response.text();
        if (data) { googleFixtures = parseICS(data); break; }
      } catch (e) { console.warn(e); }
    }
  } catch (err) { console.error("Sync failed", err); }

  const merged = googleFixtures.map(f => {
    const override = adminData.manualOverrides[f.id];
    if (override) return { ...f, ...override, isOverridden: true };
    return f;
  });

  const finalFixtures = [...merged, ...adminData.manualAdditions];
  return finalFixtures.sort((a, b) => a.date.getTime() - b.date.getTime());
};
