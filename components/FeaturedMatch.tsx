import React from 'react';
import { Fixture } from '../types';
import { MapPin, CalendarDays, Swords, PartyPopper, Sparkles } from 'lucide-react';

interface FeaturedMatchProps {
  fixtures: Fixture[];
  onClick: (fixture: Fixture) => void;
}

const FeaturedMatch: React.FC<FeaturedMatchProps> = ({ fixtures, onClick }) => {
  if (!fixtures || fixtures.length === 0) return null;

  const primaryDateObj = fixtures[0].date;
  const dateStr = primaryDateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const getCompetitionTheme = (fixture: Fixture) => {
      const text = (fixture.competition + ' ' + (fixture.competitionTag || '')).toUpperCase();
      if (text.includes('SEMI-FINAL') || text.includes('SF') || text.includes('PLATE')) return 'silver';
      if (text.includes('QUARTER-FINAL') || text.includes('QF') || text.includes('SHIELD')) return 'bronze';
      if (text.includes('FINAL') || text.includes('CUP') || text.includes('TROPHY')) return 'gold';
      return null;
  };

  const getSizeLevel = (name: string) => {
    const length = name.length;
    if (length > 25) return 0;
    if (length > 18) return 1;
    if (length > 13) return 2;
    return 3;
  };

  const sizeClasses = [
    "text-sm sm:text-base md:text-lg lg:text-xl", 
    "text-lg sm:text-xl md:text-2xl lg:text-3xl", 
    "text-xl sm:text-2xl md:text-3xl lg:text-4xl", 
    "text-2xl sm:text-3xl md:text-4xl lg:text-5xl"  
  ];

  return (
    <div className="mb-8 w-full fade-in">
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-1 h-4 bg-theme-gold"></div>
        <h3 className="text-white font-black uppercase tracking-widest text-[10px] sm:text-sm">What's Next</h3>
      </div>
      
      <div className="w-full relative overflow-hidden rounded-2xl bg-theme-dark border border-theme-gold/30 shadow-2xl shadow-black/50">
        <div className="relative flex justify-center items-center bg-black/40 backdrop-blur-md p-3 border-b border-white/5 z-20">
            <div className="flex items-center gap-2 text-white/90">
                <CalendarDays size={14} className="text-theme-gold" />
                <span className="text-[10px] sm:text-sm font-black uppercase tracking-wider">{dateStr}</span>
            </div>
        </div>

        <div className="flex flex-col divide-y divide-white/5 relative z-10">
          {fixtures.map((fixture) => {
             const isHome = fixture.isHome;
             const compLower = fixture.competition.toLowerCase();
             const isDerby = fixture.opponent.toLowerCase().includes('titan');
             const isTournament = compLower.includes('tournament');
             const isSocial = compLower.includes('social') || compLower === 'club event' || compLower.includes('training');
             
             const titansName = fixture.teamName;
             const opponentName = fixture.opponent;
             const time = fixture.date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

             const theme = getCompetitionTheme(fixture);
             const sizeLevel = Math.min(getSizeLevel(titansName), getSizeLevel(opponentName || ''));
             const sharedSizeClass = sizeClasses[sizeLevel];

             let rowBgClass = "hover:bg-theme-gold/5";
             let timeBgClass = "bg-theme-gold text-theme-base";
             let teamHighlightClass = "text-theme-gold";
             let teamNormalClass = "text-white";
             let subTextColor = "text-theme-muted";

             if (isSocial) {
                 rowBgClass = "social-glitter-static hover:opacity-90 transition-opacity";
                 timeBgClass = "bg-fuchsia-600 text-white shadow-lg";
                 teamHighlightClass = "text-white";
             } else if (theme === 'gold') {
                 rowBgClass = "bg-yellow-500/10 hover:bg-yellow-500/20";
                 timeBgClass = "bg-yellow-500 text-yellow-950";
                 teamHighlightClass = "text-yellow-400";
             }

             if (isSocial) {
                 return (
                    <button 
                      key={fixture.id}
                      onClick={() => onClick(fixture)}
                      className={`group relative p-8 sm:p-12 flex flex-col items-center justify-center gap-4 text-center w-full ${rowBgClass}`}
                    >
                        <div className="social-glitter-sparkles"></div>
                        <div className="absolute top-4 right-4 text-fuchsia-400/20 z-20 pointer-events-none">
                            <Sparkles size={40} />
                        </div>
                        <span className="bg-fuchsia-600 text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-lg flex items-center gap-1 mb-2 relative z-20">
                            <PartyPopper size={10} /> CLUB ACTIVITY
                        </span>
                        
                        <div className={`${sharedSizeClass} font-black uppercase leading-[0.9] tracking-tight px-2 text-white relative z-20 drop-shadow-lg`}>
                            {fixture.teamName}
                        </div>

                        <div className="flex flex-col items-center gap-4 mt-2 relative z-20">
                            <div className={`${timeBgClass} font-black text-lg sm:text-2xl px-6 py-1 rounded-sm transform -skew-x-12 shadow-xl whitespace-nowrap`}>
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
                    </button>
                 );
             }

             return (
              <button 
                key={fixture.id}
                onClick={() => onClick(fixture)}
                className={`group relative p-5 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 transition-all duration-300 text-left w-full ${rowBgClass}`}
              >
                <div className="flex-1 min-w-0 flex flex-col items-center text-center gap-2 order-1 sm:order-none w-full relative z-20">
                    <div className={`${sharedSizeClass} font-black uppercase leading-[1.1] tracking-tight px-2 ${isHome ? teamHighlightClass : teamNormalClass}`}>
                        {isHome ? titansName : opponentName}
                    </div>
                </div>

                <div className="shrink-0 flex flex-col items-center gap-2 min-w-[80px] sm:min-w-[120px] order-2 sm:order-none my-1 sm:my-0 relative z-20">
                    <div className="flex flex-wrap items-center justify-center gap-1 mb-1">
                        {isDerby ? (
                            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider shadow-lg flex items-center gap-1">
                                <Swords size={10} /> DERBY
                            </span>
                        ) : (
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider shadow-lg ${isHome ? 'bg-theme-gold text-theme-base' : 'bg-gradient-to-r from-[#f5abb9] to-[#5bcffa] text-white'}`}>
                                {isHome ? 'HOME' : 'AWAY'}
                            </span>
                        )}
                    </div>

                    <div className={`${timeBgClass} font-black text-lg sm:text-2xl px-4 py-1 rounded-sm transform -skew-x-12 shadow-xl whitespace-nowrap`}>
                        {time === '00:00' ? 'TBC' : time}
                    </div>
                    
                    <span className={`${subTextColor} text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-center max-w-[140px]`}>
                        {fixture.competition}
                    </span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col items-center text-center gap-2 order-3 sm:order-none w-full relative z-20">
                    <div className={`${sharedSizeClass} font-black uppercase leading-[1.1] tracking-tight px-2 ${!isHome ? teamHighlightClass : teamNormalClass}`}>
                        {isHome ? opponentName : titansName}
                    </div>
                </div>
              </button>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturedMatch;
