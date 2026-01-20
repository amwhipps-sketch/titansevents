
import React, { useState, useMemo } from 'react';
import { Fixture } from '../types';
import { Search, Trophy, Filter, Swords, ChevronDown, X, PartyPopper } from 'lucide-react';

interface FixtureListProps {
  fixtures: Fixture[];
  onEventClick: (fixture: Fixture) => void;
  showResultsMode: boolean; 
  showFilters: boolean;
}

const FILTER_TEAMS = [
    "Titans Two Brewers",
    "Titans LGBT Hero",
    "Titans Turner",
    "Titans Wheeler",
    "Titans Development",
    "Titans" 
];

const FILTER_COMPS = [
    "GFSN",
    "LUL",
    "LDL",
    "Cup",
    "Shield",
    "Plate",
    "Final"
];

const FixtureList: React.FC<FixtureListProps> = ({ fixtures, onEventClick, showResultsMode, showFilters }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<'ALL' | 'HOME' | 'AWAY'>('ALL');
  const [teamFilter, setTeamFilter] = useState<string>('ALL');
  const [compFilter, setCompFilter] = useState<string>('ALL');

  const filteredFixtures = useMemo(() => {
    return fixtures.filter(fixture => {
      if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = 
            fixture.opponent.toLowerCase().includes(searchLower) ||
            fixture.teamName.toLowerCase().includes(searchLower) ||
            fixture.competition.toLowerCase().includes(searchLower) ||
            fixture.location.toLowerCase().includes(searchLower);
            
          if (!matchesSearch) return false;
      }

      if (locationFilter === 'HOME' && !fixture.isHome) return false;
      if (locationFilter === 'AWAY' && fixture.isHome) return false;

      if (teamFilter !== 'ALL') {
          if (teamFilter === 'Titans') {
              const name = fixture.teamName;
              if (name !== 'Titans' && name !== 'Titans 1st XI' && name !== 'Titans 2nd XI') return false;
          } else if (fixture.teamName !== teamFilter) return false;
      }

      if (compFilter !== 'ALL') {
          const filterUpper = compFilter.toUpperCase();
          const tag = (fixture.competitionTag || '').toUpperCase();
          const compName = fixture.competition.toUpperCase();
          if (!tag.includes(filterUpper) && !compName.includes(filterUpper)) return false;
      }

      return true;
    });
  }, [fixtures, searchTerm, locationFilter, teamFilter, compFilter]);

  const groupedFixtures = useMemo(() => {
    const groups: Record<string, Fixture[]> = {};
    filteredFixtures.forEach(fixture => {
      const monthYear = fixture.date.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
      if (!groups[monthYear]) groups[monthYear] = [];
      groups[monthYear].push(fixture);
    });
    return groups;
  }, [filteredFixtures]);

  const resetFilters = () => {
      setSearchTerm('');
      setLocationFilter('ALL');
      setTeamFilter('ALL');
      setCompFilter('ALL');
  };

  const getCompetitionTheme = (fixture: Fixture) => {
      const text = (fixture.competition + ' ' + (fixture.competitionTag || '')).toUpperCase();
      if (text.includes('SEMI-FINAL') || text.includes('SF') || text.includes('PLATE')) return 'silver';
      if (text.includes('QUARTER-FINAL') || text.includes('QF') || text.includes('SHIELD')) return 'bronze';
      if (text.includes('FINAL') || text.includes('CUP') || text.includes('TROPHY')) return 'gold';
      return null;
  };

  return (
    <div className="flex flex-col gap-6">
      {showFilters && (
        <div className="bg-theme-dark p-3 sm:p-4 rounded-2xl border border-theme-light/30 shadow-lg overflow-hidden animate-fadeIn">
          <div className="flex flex-col gap-3">
              <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted w-4 h-4" />
                  <input 
                      type="text" 
                      placeholder="Search events, teams, locations..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-theme-base border border-theme-light rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-theme-gold transition-colors placeholder:text-theme-muted/50 font-medium"
                  />
                  {searchTerm && (
                      <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-white">
                          <X size={14} />
                      </button>
                  )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="col-span-2 md:col-span-1 bg-theme-base p-1 rounded-lg border border-theme-light/30 flex text-[10px] font-bold">
                      <button onClick={() => setLocationFilter('ALL')} className={`flex-1 py-1.5 rounded transition-all ${locationFilter === 'ALL' ? 'bg-theme-gold text-theme-base shadow-sm' : 'text-theme-muted hover:text-white'}`}>All</button>
                      <button onClick={() => setLocationFilter('HOME')} className={`flex-1 py-1.5 rounded transition-all ${locationFilter === 'HOME' ? 'bg-theme-gold text-theme-base shadow-sm' : 'text-theme-muted hover:text-white'}`}>Home</button>
                      <button onClick={() => setLocationFilter('AWAY')} className={`flex-1 py-1.5 rounded transition-all ${locationFilter === 'AWAY' ? 'bg-theme-gold text-theme-base shadow-sm' : 'text-theme-muted hover:text-white'}`}>Away</button>
                  </div>
                  <div className="col-span-1 relative">
                      <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)} className="w-full h-full appearance-none bg-theme-base border border-theme-light/30 rounded-lg pl-2 pr-5 sm:pr-8 py-2 text-[10px] font-bold text-white focus:outline-none focus:border-theme-gold cursor-pointer">
                          <option value="ALL">Team</option>
                          {FILTER_TEAMS.map(t => <option key={t} value={t}>{t.replace('Titans ', '')}</option>)}
                      </select>
                      <ChevronDown className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 text-theme-muted pointer-events-none w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <div className="col-span-1 relative">
                      <select value={compFilter} onChange={(e) => setCompFilter(e.target.value)} className="w-full h-full appearance-none bg-theme-base border border-theme-light/30 rounded-lg pl-2 pr-5 sm:pr-8 py-2 text-[10px] font-bold text-white focus:outline-none focus:border-theme-gold cursor-pointer">
                          <option value="ALL">Comp</option>
                          {FILTER_COMPS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 text-theme-muted pointer-events-none w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
              </div>
              
              {(searchTerm || locationFilter !== 'ALL' || teamFilter !== 'ALL' || compFilter !== 'ALL') && (
                  <button onClick={resetFilters} className="text-xs text-theme-gold hover:underline font-bold text-center mt-1">Clear All Filters</button>
              )}
          </div>
        </div>
      )}

      <div className="space-y-6 sm:space-y-8 pb-12">
        {Object.keys(groupedFixtures).length === 0 ? (
           <div className="text-center py-20 opacity-50 flex flex-col items-center border border-dashed border-theme-light rounded-2xl">
             <Filter className="w-12 h-12 mb-4 text-theme-muted" />
             <p className="text-theme-muted font-bold text-lg">No events found</p>
             <p className="text-theme-muted/50 text-sm">Try adjusting your filters or search</p>
           </div>
        ) : (
          Object.entries(groupedFixtures).map(([month, monthFixtures]) => (
            <div key={month}>
              <div className="flex items-center gap-3 mb-4 pl-1">
                <div className="h-px bg-theme-light flex-grow"></div>
                <h3 className="text-[10px] sm:text-xs font-black uppercase text-theme-muted tracking-[0.2em]">{month}</h3>
                <div className="h-px bg-theme-light flex-grow"></div>
              </div>

              <div className="grid gap-3">
                {(monthFixtures as Fixture[]).map(fixture => {
                   const isCompleted = fixture.status === 'completed';
                   const isDerby = fixture.opponent.toLowerCase().includes('titan');
                   const isTournament = fixture.competition.toLowerCase().includes('tournament');
                   const isSocial = fixture.competition.toLowerCase().includes('social') || fixture.competition === 'Club Event';
                   const theme = getCompetitionTheme(fixture);
                   
                   let barBgClass = fixture.isHome ? 'bg-theme-gold' : 'bg-gradient-to-b from-[#f5abb9] to-[#5bcffa]';
                   let rowBgClass = 'bg-theme-dark hover:bg-[#26241E]';
                   let teamNameColor: (isTitans: boolean) => string = (isTitans: boolean) => isTitans ? 'text-theme-gold' : 'text-white';

                   if (theme === 'gold' && !isCompleted) {
                       barBgClass = 'bg-yellow-500'; 
                       rowBgClass = 'bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/40';
                       teamNameColor = (isTitans: boolean) => isTitans ? 'text-yellow-400' : 'text-white';
                   } else if (theme === 'silver' && !isCompleted) {
                       barBgClass = 'bg-slate-300'; 
                       rowBgClass = 'bg-slate-300/15 hover:bg-slate-300/25 border-slate-400/30';
                       teamNameColor = (isTitans: boolean) => isTitans ? 'text-slate-100' : 'text-slate-300';
                   } else if (theme === 'bronze' && !isCompleted) {
                       barBgClass = 'bg-[#cd7f32]'; 
                       rowBgClass = 'bg-[#cd7f32]/15 hover:bg-[#cd7f32]/25 border-[#cd7f32]/30';
                       teamNameColor = (isTitans: boolean) => isTitans ? 'text-[#ffc490]' : 'text-[#f5e3d3]';
                   }
                   
                   if (isTournament && !isCompleted && !theme) {
                       barBgClass = 'bg-indigo-600'; 
                       rowBgClass = 'bg-indigo-600/15 hover:bg-indigo-600/25 border-indigo-400/30';
                   } else if (isSocial && !isCompleted) {
                       barBgClass = 'bg-fuchsia-600';
                       rowBgClass = 'bg-fuchsia-950/10 hover:bg-fuchsia-950/20 border-fuchsia-400/20';
                       teamNameColor = () => 'text-white';
                   }

                   const timeStr = fixture.date.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'});
                   const displayTime = timeStr === '00:00' ? 'TBC' : timeStr;
                   const dayDate = fixture.date.toLocaleDateString('en-GB', { day: 'numeric', weekday: 'short' });

                   return (
                     <button 
                        key={fixture.id}
                        onClick={() => onEventClick(fixture)}
                        className={`relative w-full text-left rounded-xl overflow-hidden transition-all duration-200 transform hover:-translate-y-0.5 pl-4 pr-3 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 ${rowBgClass} border border-theme-light/30 hover:border-theme-gold/30 shadow-md hover:shadow-xl ${isSocial && !isCompleted ? 'social-glimmer' : ''}`}
                     >
                         <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${barBgClass} z-20`}></div>
                         <div className="flex flex-col items-center justify-center min-w-[40px] sm:min-w-[50px] border-r border-theme-light/10 pr-3 sm:pr-4 flex-shrink-0 relative z-20">
                             <span className="text-[9px] sm:text-[10px] uppercase font-bold text-theme-muted">{dayDate.split(' ')[0]}</span>
                             <span className="text-base sm:text-xl font-black text-white">{dayDate.split(' ')[1]}</span>
                         </div>
                         <div className="flex-grow min-w-0 relative z-20">
                             <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                                 {isDerby ? (
                                    <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white text-[8px] sm:text-[9px] font-black px-1 sm:px-1.5 py-0.5 rounded flex items-center gap-1"><Swords size={9} /> DERBY</span>
                                 ) : isTournament ? (
                                    <span className="bg-indigo-600 text-white text-[8px] sm:text-[9px] font-black px-1 sm:px-1.5 py-0.5 rounded flex items-center gap-1"><Swords size={9} /> TOURNAMENT</span>
                                 ) : isSocial ? (
                                    <span className="bg-fuchsia-600 text-white text-[8px] sm:text-[9px] font-black px-1 sm:px-1.5 py-0.5 rounded flex items-center gap-1"><PartyPopper size={9} /> SOCIAL</span>
                                 ) : (
                                    <span className={`text-[8px] sm:text-[9px] font-black px-1 sm:px-1.5 py-0.5 rounded ${fixture.isHome ? 'bg-theme-gold text-theme-base' : 'bg-gradient-to-r from-[#f5abb9] to-[#5bcffa] text-white'}`}>{fixture.isHome ? 'HOME' : 'AWAY'}</span>
                                 )}
                                 <span className="text-[9px] sm:text-[10px] uppercase tracking-wider truncate flex-grow text-theme-muted">{fixture.competition}</span>
                                 {fixture.competitionTag && <span className={`inline-flex items-center gap-1 text-[8px] px-1 rounded border ${theme === 'gold' ? 'bg-yellow-500 text-yellow-950 border-yellow-400' : theme === 'silver' ? 'bg-slate-300 text-slate-900 border-slate-200' : theme === 'bronze' ? 'bg-[#cd7f32] text-white border-[#e09f70]' : 'bg-theme-light text-theme-gold border-theme-gold/20'}`}><Trophy size={8} /> {fixture.competitionTag}</span>}
                             </div>
                             <div className="flex flex-col leading-tight gap-0.5 min-w-0">
                                <span className={`text-xs sm:text-base uppercase font-bold ${teamNameColor(fixture.isHome || !fixture.opponent)} truncate`}>{fixture.isHome ? fixture.teamName : (fixture.opponent || fixture.teamName)}</span>
                                {fixture.opponent && <span className={`text-xs sm:text-base uppercase font-bold ${teamNameColor(!fixture.isHome)} truncate`}>{fixture.isHome ? fixture.opponent : fixture.teamName}</span>}
                             </div>
                         </div>
                         <div className="flex-shrink-0 text-right min-w-[60px] sm:min-w-[100px] flex justify-end relative z-20">
                            <div className="text-right overflow-hidden flex flex-col items-end max-w-[80px] sm:max-w-[120px]">
                                <div className="text-white font-bold font-mono text-[11px] sm:text-sm leading-none mb-1 whitespace-nowrap">{displayTime}</div>
                                <div className="text-[8px] sm:text-[10px] uppercase font-bold leading-tight text-right w-full line-clamp-2 text-theme-muted">{fixture.location && fixture.location !== 'TBC' ? fixture.location.split(',')[0] : 'TBC'}</div>
                            </div>
                         </div>
                     </button>
                   );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FixtureList;
