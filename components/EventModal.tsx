
import React, { useState, useEffect } from 'react';
import { Fixture } from '../types';
import { X, Clock, MapPin, Trophy, CalendarDays, Swords, Sparkles, ExternalLink, Map, PartyPopper } from 'lucide-react';
import { Badge } from './Badge';

interface EventModalProps {
  fixture: Fixture;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ fixture, onClose }) => {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIphone = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isIphone);
  }, []);

  const dayName = fixture.date.toLocaleDateString('en-GB', { weekday: 'long' });
  const fullDate = fixture.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = fixture.date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const displayTime = timeStr === '00:00' ? 'TBC' : timeStr;
  
  const isHome = fixture.isHome;
  const isCompleted = fixture.status === 'completed';

  const titansName = fixture.teamName;
  const hasOpponent = !!fixture.opponent;
  const topTeam = isHome ? titansName : fixture.opponent;
  const bottomTeam = isHome ? fixture.opponent : titansName;
  const isTopTitans = isHome;
  const isBottomTitans = !isHome;

  const isDerby = fixture.opponent.toLowerCase().includes('titan');
  const isTraining = fixture.competition.toLowerCase().includes('training');
  const isTournament = fixture.competition.toLowerCase().includes('tournament');
  const isClubEvent = fixture.competition === 'Club Event';
  const isSocial = fixture.competition.toLowerCase().includes('social') || isClubEvent;
  
  const isBall = isClubEvent && fixture.teamName.toLowerCase().includes('ball');

  const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
  };

  const getResultBg = (result?: 'W' | 'L' | 'D') => {
    switch (result) {
      case 'W': return 'bg-green-600 text-white';
      case 'L': return 'bg-red-600 text-white';
      case 'D': return 'bg-blue-600 text-white';
      default: return 'bg-theme-gold text-theme-base';
    }
  };
  
  const getResultTextColor = (result?: 'W' | 'L' | 'D') => {
      switch(result) {
          case 'W': return 'text-green-500';
          case 'L': return 'text-red-500';
          case 'D': return 'text-blue-500';
          default: return 'text-theme-gold';
      }
  };

  const getResultLabel = (result?: 'W' | 'L' | 'D') => {
      switch(result) {
          case 'W': return 'WIN';
          case 'L': return 'LOSS';
          case 'D': return 'DRAW';
          default: return '';
      }
  };

  const getCompetitionTheme = () => {
      const text = (fixture.competition + ' ' + (fixture.competitionTag || '')).toUpperCase();
      if (text.includes('CUP') || text.includes('FINAL')) return 'gold';
      if (text.includes('PLATE') || text.includes('SEMI-FINAL') || text.includes('SF')) return 'silver';
      if (text.includes('SHIELD') || text.includes('QUARTER-FINAL') || text.includes('QF')) return 'bronze';
      if (text.includes('TROPHY')) return 'gold';
      return null;
  };

  const theme = getCompetitionTheme();
  const isSpecial = !!theme;

  let headerBgClass = isHome 
    ? 'bg-gradient-to-r from-[#FFD102] to-[#26241E] text-white' 
    : 'bg-gradient-to-r from-[#f5abb9] to-[#5bcffa] text-white';
  
  let borderColorClass = isHome ? 'border-theme-gold' : 'border-[#f5abb9]';
  let bodyBgClass = 'bg-theme-base';
  let titleTextColor = 'text-white';
  let subtitleTextColor = 'text-theme-gold';
  let teamTextColor: (isTitans: boolean) => string = (isTitans: boolean) => isTitans ? 'text-theme-gold' : 'text-white';

  if (isTraining) {
      headerBgClass = 'bg-slate-800 text-white';
      borderColorClass = 'border-slate-700';
  } else if (isTournament) {
      headerBgClass = 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white';
      borderColorClass = 'border-indigo-500';
  } else if (isSocial) {
      headerBgClass = 'bg-fuchsia-600 text-white';
      borderColorClass = 'border-fuchsia-500';
      bodyBgClass = isBall ? 'bg-gradient-to-br from-indigo-950 to-fuchsia-950' : 'bg-gradient-to-br from-indigo-900 via-[#1D1B17] to-fuchsia-900';
      subtitleTextColor = 'text-fuchsia-400';
  } else if (theme === 'gold') {
      headerBgClass = 'bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 text-yellow-900';
      borderColorClass = 'border-yellow-500';
      bodyBgClass = 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500';
      titleTextColor = 'text-yellow-950';
      subtitleTextColor = 'text-yellow-800/60';
      teamTextColor = (isTitans: boolean) => isTitans ? 'text-yellow-950' : 'text-yellow-900/80';
  } else if (theme === 'silver') {
      headerBgClass = 'bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-900';
      borderColorClass = 'border-slate-300';
      bodyBgClass = 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400';
      titleTextColor = 'text-slate-950';
      subtitleTextColor = 'text-slate-800/60';
      teamTextColor = (isTitans: boolean) => isTitans ? 'text-slate-950' : 'text-slate-900/80';
  } else if (theme === 'bronze') {
      headerBgClass = 'bg-gradient-to-r from-[#cd7f32] via-[#E09F70] to-[#8c5626] text-white';
      borderColorClass = 'border-[#cd7f32]';
      bodyBgClass = 'bg-gradient-to-br from-[#cd7f32] via-[#E09F70] to-[#8c5626]';
      titleTextColor = 'text-white';
      subtitleTextColor = 'text-white/60';
      teamTextColor = (isTitans: boolean) => 'text-white';
  }

  if (isDerby && !isTraining && !isSpecial) {
      headerBgClass = 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white';
      borderColorClass = 'border-purple-500';
  }

  const derbyBadgeClass = 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white shadow-[0_0_8px_rgba(236,72,153,0.5)] animate-pulse';
  const haBadgeHomeClass = 'bg-gradient-to-r from-[#FFD102] to-[#26241E] text-white';

  // Helper to determine font size level based on string length
  const getSizeLevel = (name: string) => {
    if (name.length > 25) return 0; // Smallest
    if (name.length > 15) return 1; // Medium
    return 2; // Largest
  };

  const sizeClasses = [
    'text-xl sm:text-2xl', // Level 0
    'text-3xl sm:text-4xl', // Level 1
    'text-4xl sm:text-6xl'  // Level 2
  ];

  // Calculate shared size class for both teams to ensure they match
  const topSizeLevel = getSizeLevel(topTeam || '');
  const bottomSizeLevel = getSizeLevel(bottomTeam || '');
  const sharedSizeLevel = Math.min(topSizeLevel, bottomSizeLevel);
  const sharedSizeClass = sizeClasses[sharedSizeLevel];
  
  // Specific single team font size for social/training
  const singleTeamSizeLevel = getSizeLevel(fixture.teamName);
  const singleTeamSizeClass = sizeClasses[singleTeamSizeLevel];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-sm fade-in" onClick={handleOverlayClick}>
        <div className={`w-full max-w-md overflow-hidden zoom-in relative shadow-2xl rounded-xl border-2 ${borderColorClass} bg-theme-base max-h-[90vh] flex flex-col`}>
            
            <button 
                onClick={onClose} 
                className="absolute top-3 right-3 z-30 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
            >
                <X className="w-5 h-5" />
            </button>

            {/* HEADER */}
            <div className={`px-4 sm:px-6 py-2.5 flex justify-between items-center text-[10px] sm:text-xs font-black uppercase tracking-wider relative z-10 flex-shrink-0 ${headerBgClass}`}>
                <div className="flex items-center gap-2">
                    {isSocial ? (
                        <span className="bg-black/20 px-2 py-0.5 rounded border border-black/10 flex items-center gap-1">
                           <PartyPopper size={10}/> Club Social
                        </span>
                    ) : (
                        <span>
                            {isTraining ? 'Training Session' : 
                             isTournament ? 'Tournament' : 
                             isDerby ? 'Derby Match' : 
                             (isHome ? 'Home Match' : 'Away Match')}
                        </span>
                    )}
                </div>
                <span className="flex items-center gap-1">
                    {isSpecial ? <Trophy size={14} /> : (isTraining ? <CalendarDays size={14} /> : (isTournament ? <Swords size={14} /> : (isSocial ? <PartyPopper size={14} /> : null)))} 
                    {fixture.competition}
                    {fixture.competitionTag && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-sm bg-black/10 border border-black/10">
                            {fixture.competitionTag}
                        </span>
                    )}
                </span>
            </div>

            <div className="overflow-y-auto custom-scrollbar flex-grow">
                {/* BODY */}
                <div className={`p-8 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${bodyBgClass} ${isSocial ? 'social-glimmer' : ''}`}>
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none w-64 h-64 grayscale ${isSpecial ? 'mix-blend-multiply' : ''} z-10`}>
                        <Badge />
                    </div>
                    
                    {isSocial ? (
                         <div className="flex flex-col items-center gap-1 relative z-20 w-full mb-4">
                            <Sparkles className="absolute top-[-20px] right-[-10px] text-fuchsia-400/40 animate-float-sparkle" size={48} />
                            <span className={`${subtitleTextColor} font-black text-xs sm:text-sm uppercase tracking-[0.4em] mb-2`}>{dayName}</span>
                            <div className="text-white font-black text-2xl sm:text-4xl uppercase leading-none tracking-tight">{fullDate.split(' ')[0]} {fullDate.split(' ')[1]} {fullDate.split(' ')[2]}</div>
                            <div className="text-white font-black text-lg sm:text-2xl uppercase opacity-50 mb-10">{fullDate.split(' ')[3]}</div>
                            
                            <div className={`${singleTeamSizeClass} font-black uppercase text-center leading-[0.9] drop-shadow-lg px-2 ${isBall ? 'text-theme-gold' : 'text-white'}`}>
                                {fixture.teamName}
                            </div>
                         </div>
                    ) : (
                        <>
                            <div className={`${subtitleTextColor} font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-2 relative z-20 text-center`}>{dayName}</div>
                            <div className={`${titleTextColor} font-black text-xl sm:text-2xl uppercase mb-8 relative z-20 text-center`}>{fullDate}</div>

                            <div className="w-full flex flex-col items-center gap-4 relative z-20">
                                {hasOpponent && !isTraining ? (
                                    <>
                                        <div className={`${sharedSizeClass} font-black uppercase text-center leading-[1.1] drop-shadow-md px-2 ${teamTextColor(isTopTitans)}`}>
                                            {topTeam}
                                        </div>
                                        
                                        {isCompleted && fixture.score ? (
                                            <div className={`${getResultBg(fixture.result)} font-black text-xl px-4 py-2 rounded-sm shadow-lg transform -skew-x-12 min-w-[80px] text-center`}>
                                                {fixture.score}
                                            </div>
                                        ) : (
                                            <div className={`${isSpecial ? 'bg-black/20 text-white' : 'bg-theme-gold text-theme-base'} font-black text-xs px-3 py-1 -skew-x-12 transform`}>
                                                VS
                                            </div>
                                        )}
                    
                                        <div className={`${sharedSizeClass} font-black uppercase text-center leading-[1.1] drop-shadow-lg px-2 ${teamTextColor(isBottomTitans)}`}>
                                            {bottomTeam}
                                        </div>
                                    </>
                                ) : (
                                    <div className={`${singleTeamSizeClass} font-black uppercase text-center leading-[1.1] drop-shadow-lg px-2 ${isSpecial ? titleTextColor : 'text-theme-gold'}`}>
                                        {fixture.teamName}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* FOOTER */}
                <div className={`${isSocial ? 'bg-black/40' : 'bg-theme-light'} p-6 sm:p-8 border-t border-white/5 relative z-30`}>
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4 text-theme-text">
                            <Clock className={`w-6 h-6 flex-shrink-0 ${isSocial ? 'text-fuchsia-400' : 'text-theme-gold'}`} />
                            <div className="flex-1 min-w-0">
                                <span className="block text-[10px] text-theme-muted uppercase font-black tracking-widest mb-1">Time</span>
                                <div className="flex items-center gap-2">
                                    {!isSocial && hasOpponent && !isTraining && !isTournament && (
                                        <span className={`
                                            rounded-[2px] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider leading-none min-w-[14px] text-center shadow-sm
                                            ${isDerby ? derbyBadgeClass : (isHome ? haBadgeHomeClass : 'bg-gradient-to-r from-[#f5abb9] to-[#5bcffa] text-white')}
                                        `}>
                                            {isDerby ? 'DERBY' : (isHome ? 'H' : 'A')}
                                        </span>
                                    )}
                                    <span className="font-black text-xl sm:text-2xl whitespace-nowrap text-white">{displayTime}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-theme-text">
                            <MapPin className={`w-6 h-6 flex-shrink-0 ${isSocial ? 'text-fuchsia-400' : 'text-theme-gold'}`} />
                            <div className="flex-1 min-w-0">
                                <span className="block text-[10px] text-theme-muted uppercase font-black tracking-widest mb-1">Location</span>
                                {fixture.location && fixture.location !== 'TBC' ? (
                                    <div className="flex flex-col items-start gap-1 max-w-full overflow-hidden">
                                        <a 
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fixture.location)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 group cursor-pointer transition-all w-full"
                                        >
                                            <span className="font-bold text-base sm:text-lg text-white group-hover:text-theme-gold transition-colors text-left leading-tight break-words hyphens-auto uppercase tracking-wide">
                                                {fixture.location}
                                            </span>
                                            <ExternalLink size={16} className="text-theme-muted group-hover:text-theme-gold transition-colors shrink-0" />
                                        </a>
                                        {isIOS && (
                                            <a 
                                                href={`http://maps.apple.com/?q=${encodeURIComponent(fixture.location)}`}
                                                className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-theme-muted hover:text-white transition-colors bg-white/5 px-2 py-1 rounded mt-1"
                                            >
                                                <Map size={12} /> Apple Maps
                                            </a>
                                        )}
                                    </div>
                                ) : (
                                    <span className="font-black text-base sm:text-lg text-theme-muted uppercase tracking-widest">TBC</span>
                                )}
                            </div>
                        </div>

                        {isCompleted && fixture.result && (
                            <div className="flex items-center gap-4 text-theme-text border-t border-white/5 pt-6 mt-2">
                                <div className={`w-6 h-6 flex-shrink-0 rounded-full border-4 ${getResultTextColor(fixture.result).replace('text-', 'border-')} opacity-80`}></div>
                                <div>
                                    <span className="block text-[10px] text-theme-muted uppercase font-black tracking-widest mb-1">Result</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`font-black text-xl sm:text-2xl uppercase tracking-widest ${getResultTextColor(fixture.result)}`}>
                                            {getResultLabel(fixture.result)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default EventModal;
