
import React from 'react';
import { Fixture } from '../types';
import { MapPin, CalendarDays, Trophy, Swords, PartyPopper, Sparkles } from 'lucide-react';

interface FeaturedMatchProps {
  fixtures: Fixture[];
  onClick: (fixture: Fixture) => void;
}

const FeaturedMatch: React.FC<FeaturedMatchProps> = ({ fixtures, onClick }) => {
  if (!fixtures || fixtures.length === 0) return null;

  const primaryDateObj = fixtures[0].date;
  const dateStr = primaryDateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  // Helper to determine special styling theme
  const getCompetitionTheme = (fixture: Fixture) => {
      const text = (fixture.competition + ' ' + (fixture.competitionTag || '')).toUpperCase();
      if (text.includes('SEMI-FINAL') || text.includes('SF') || text.includes('PLATE')) return 'silver';
      if (text.includes('QUARTER-FINAL') || text.includes('QF') || text.includes('SHIELD')) return 'bronze';
      if (text.includes('FINAL') || text.includes('CUP') || text.includes('TROPHY')) return 'gold';
      return null;
  };

  // Helper to determine font size level based on string length
  const getSizeLevel = (name: string) => {
    const length = name.length;
    if (length > 25) return 0; // Very Small
    if (length > 18) return 1; // Small
    if (length > 13) return 2; // Medium
    return 3; // Large
  };

  const sizeClasses = [
    "text-sm sm:text-base md:text-lg lg:text-xl", 
    "text-lg sm:text-xl md:text-2xl lg:text-3xl", 
    "text-xl sm:text-2xl md:text-3xl lg:text-4xl", 
    "text-2xl sm:text-3xl md:text-4xl lg:text-5xl"  
  ];

  return (
    <div className="mb-8 w-full">
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-1 h-4 bg-theme-gold"></div>
        <h3 className="text-white font-black uppercase tracking-widest text-[10px] sm:text-sm">What's Next</h3>
      </div>
      
      <div className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-theme-light to-[#1a1814] border border-theme-gold/30 shadow-2xl shadow-black/50">
        <div className="relative flex justify-center items-center bg-black/40 backdrop-blur-sm p-3 border-b border-white/5">
            <div className="flex items-center gap-2 text-white/90">
                <CalendarDays size={14} className="text-theme-gold" />
                <span className="text-[10px] sm:text-sm font-black uppercase tracking-wider">{dateStr}</span>
            </div>
        </div>

        <div className="flex flex-col divide-y divide-white/5 relative z-10">
          {fixtures.map((fixture) => {
             const isHome = fixture.isHome;
             const isDerby = fixture.opponent.toLowerCase().includes('titan');
             const isTournament = fixture.competition.toLowerCase().includes('tournament');
             const isSocial = fixture.competition.toLowerCase().includes('social') || fixture.competition === 'Club Event';
             const titansName = fixture.teamName;
             const opponentName = fixture.opponent;
             const time = fixture.date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

             const theme = getCompetitionTheme(fixture);
             const isSpecial = !!theme;

             const sizeLevel = Math.min(getSizeLevel(titansName), getSizeLevel(opponentName || ''));
             const sharedSizeClass = sizeClasses[sizeLevel];

             let rowBgClass = "hover:bg-theme-gold/5";
             let timeBgClass = "bg-theme-gold text-theme-base";
             let teamHighlightClass = "text-theme-gold";
             let teamNormalClass = "text-white";
             let subTextColor = "text-theme-muted";

             if (isSocial) {
                 rowBgClass = "bg-gradient-to-r from-indigo-950/40 via-fuchsia-900/20 to-indigo-950/40 hover:bg-fuchsia-900/30";
                 timeBgClass = "bg-fuchsia-600 text-white shadow-[0_0_15px_rgba(192,38,211,0.4)]";
                 teamHighlightClass = "text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-indigo-300";
             } else if (theme === 'gold') {
                 rowBgClass = "bg-yellow-500/10 hover:bg-yellow-500/20";
                 timeBgClass = "bg-yellow-500 text-yellow-950 shadow-[0_0_15px_rgba(234,179,8,0.4)]";
                 teamHighlightClass = "text-yellow-400";
                 subTextColor = "text-yellow-200/50";
             } else if (theme === 'silver') {
                 rowBgClass = "bg-slate-400/10 hover:bg-slate-400/20";
                 timeBgClass = "bg-slate-300 text-slate-900 shadow-[0_0_15px_rgba(203,213,225,0.4)]";
                 teamHighlightClass = "text-slate-200";
                 subTextColor = "text-slate-400/50";
             } else if (theme === 'bronze') {
                 rowBgClass = "bg-[#cd7f32]/10 hover:bg-[#cd7f32]/20";
                 timeBgClass = "bg-[#cd7f32] text-white shadow-[0_0_15px_rgba(205,127,50,0.4)]";
                 teamHighlightClass = "text-[#ffc490]";
                 subTextColor = "text-[#cd7f32]/60";
             } else if (isTournament) {
                 rowBgClass = "bg-indigo-600/10 hover:bg-indigo-600/20";
                 timeBgClass = "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]";
             }

             const getTeamNameClass = (isHighlighted: boolean) => {
               return `${sharedSizeClass} font-black uppercase leading-[1.1] tracking-tight break-words px-2 ${isHighlighted ? teamHighlightClass : teamNormalClass}`;
             };

             if (isSocial) {
                 return (
                    <button 
                      key={fixture.id}
                      onClick={() => onClick(fixture)}
                      className={`group/item relative p-8 sm:p-12 flex flex-col items-center justify-center gap-4 transition-all duration-300 text-center w-full ${rowBgClass} social-glimmer`}
                    >
                        <div className="absolute top-4 right-4 text-fuchsia-500/30 animate-float-sparkle z-20">
                            <Sparkles size={40} />
                        </div>
                        <span className="bg-fuchsia-600 text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-lg flex items-center gap-1 mb-2 relative z-20">
                            <PartyPopper size={10} /> SOCIAL EVENT
                        </span>
                        
                        <div className={`${getTeamNameClass(true)} relative z-20`}>
                            {fixture.teamName}
                        </div>

                        <div className="flex flex-col items-center gap-4 mt-2 relative z-20">
                            <div className={`${timeBgClass} font-black text-lg sm:text-2xl px-6 py-1 rounded-sm transform -skew-x-12 shadow-xl ring-2 ring-white/5 whitespace-nowrap`}>
                                {time === '00:00' ? 'TBC' : time}
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">{fixture.competition}</span>
                                <div className="flex items-center gap-1 text-white/40 text-[10px] font-bold uppercase tracking-wide">
                                    <MapPin size={10} />
                                    <span>{fixture.location.split(',')[0]}</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 border-l-4 border-transparent group-hover/item:border-fuchsia-500 transition-all duration-300 pointer-events-none z-30"></div>
                    </button>
                 );
             }

             return (
              <button 
                key={fixture.id}
                onClick={() => onClick(fixture)}
                className={`group/item relative p-5 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8 hover:opacity-100 transition-all duration-300 text-left w-full ${rowBgClass}`}
              >
                <div className="flex-1 min-w-0 flex flex-col items-center text-center gap-2 order-1 sm:order-none w-full relative z-20">
                    <div className={getTeamNameClass(isHome)}>
                        {isHome ? titansName : opponentName}
                    </div>
                </div>

                <div className="shrink-0 flex flex-col items-center gap-2 min-w-[80px] sm:min-w-[120px] order-2 sm:order-none my-1 sm:my-0 relative z-20">
                    <div className="flex flex-wrap items-center justify-center gap-1 mb-1">
                        {isDerby ? (
                            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider shadow-lg flex items-center gap-1">
                                <Swords size={10} /> DERBY
                            </span>
                        ) : isTournament ? (
                            <span className="bg-indigo-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider shadow-lg flex items-center gap-1">
                                <Swords size={10} /> TOURNAMENT
                            </span>
                        ) : (
                            <span className={`
                                text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider shadow-lg
                                ${isHome ? 'bg-theme-gold text-theme-base' : 'bg-gradient-to-r from-[#f5abb9] to-[#5bcffa] text-white'}
                            `}>
                                {isHome ? 'HOME' : 'AWAY'}
                            </span>
                        )}
                    </div>

                    <div className={`${timeBgClass} font-black text-lg sm:text-2xl px-4 py-1 rounded-sm transform -skew-x-12 shadow-xl ring-2 ring-white/5 whitespace-nowrap`}>
                        {time === '00:00' ? 'TBC' : time}
                    </div>
                    
                    <div className="flex flex-col items-center gap-0.5 max-w-[140px]">
                        <span className={`flex items-center gap-1.5 ${subTextColor} text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-center break-words`}>
                           {isSpecial && <Trophy size={9} className="flex-shrink-0" />}
                           {fixture.competition}
                        </span>
                        <div className={`flex items-center gap-1 ${subTextColor} text-[8px] sm:text-[9px] font-bold uppercase tracking-wide opacity-70`}>
                            <MapPin size={9} className="flex-shrink-0" />
                            <span className="truncate max-w-[80px] sm:max-w-none">{fixture.location.split(',')[0]}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col items-center text-center gap-2 order-3 sm:order-none w-full relative z-20">
                    <div className={getTeamNameClass(!isHome)}>
                        {isHome ? opponentName : titansName}
                    </div>
                </div>

                <div className={`absolute inset-0 border-l-4 border-transparent group-hover/item:border-theme-gold transition-all duration-300 pointer-events-none ${isSpecial ? 'opacity-50' : ''} z-30`}></div>
              </button>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturedMatch;
