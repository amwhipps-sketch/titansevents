
import React, { useMemo } from 'react';
import { Fixture } from '../types';
import { Trophy, Swords, Eye, PartyPopper } from 'lucide-react';
import { WEEKDAY_BG_IMAGE } from '../constants';

interface CalendarGridProps {
  currentDate: Date;
  fixtures: Fixture[];
  onEventClick: (fixture: Fixture) => void;
  showWeekdays: boolean;
  onShowWeekdaysChange: (show: boolean) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, fixtures, onEventClick, showWeekdays, onShowWeekdaysChange }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayStandard = new Date(year, month, 1).getDay();
  // Convert Sunday (0) -> 6, Monday (1) -> 0, etc.
  const firstDay = (firstDayStandard - 1 + 7) % 7;
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const today = new Date();

  const cells = [];
  
  // Prev Month Padding
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, prevMonthDays - i), isCurrent: false });
  }
  
  // Current Month
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ date: new Date(year, month, i), isCurrent: true });
  }
  
  // Dynamic Next Month Padding
  const totalCellsSoFar = cells.length;
  const totalCellsNeeded = Math.ceil(totalCellsSoFar / 7) * 7;
  const remaining = totalCellsNeeded - totalCellsSoFar;
  
  for (let i = 1; i <= remaining; i++) {
    cells.push({ date: new Date(year, month + 1, i), isCurrent: false });
  }

  // Group cells into weeks
  const weeks = useMemo(() => {
    const w = [];
    for (let i = 0; i < cells.length; i += 7) {
      w.push(cells.slice(i, i + 7));
    }
    return w;
  }, [cells]);

  // Detect hidden weekday events for the bottom toggle button
  const allHiddenWeekdayEvents = useMemo(() => {
      if (showWeekdays) return [];
      return fixtures.filter(f => {
          const d = f.date.getDay();
          const isWeekday = d >= 1 && d <= 5;
          const isInCurrentView = cells.some(c => 
            c.date.getDate() === f.date.getDate() && 
            c.date.getMonth() === f.date.getMonth() && 
            c.date.getFullYear() === f.date.getFullYear()
          );
          return isWeekday && isInCurrentView;
      });
  }, [fixtures, showWeekdays, cells]);

  const hasHiddenWeekdayEvents = allHiddenWeekdayEvents.length > 0;

  // Helper to determine special styling theme
  const getCompetitionTheme = (fixture: Fixture) => {
      const text = (fixture.competition + ' ' + (fixture.competitionTag || '')).toUpperCase();
      if (text.includes('SEMI-FINAL') || text.includes('SF') || text.includes('PLATE')) return 'silver';
      if (text.includes('QUARTER-FINAL') || text.includes('QF') || text.includes('SHIELD')) return 'bronze';
      if (text.includes('FINAL') || text.includes('CUP') || text.includes('TROPHY')) return 'gold';
      return null;
  };

  const getEventChipStyles = (event: Fixture) => {
    const isSocial = event.competition.toLowerCase().includes('social') || event.competition === 'Club Event';
    const isTraining = event.competition.toLowerCase().includes('training');
    const isTournament = event.competition.toLowerCase().includes('tournament');
    const theme = getCompetitionTheme(event);

    if (isSocial) return 'bg-fuchsia-600 shadow-[0_0_8px_rgba(192,38,211,0.6)] social-glimmer';
    if (isTraining) return 'bg-slate-500';
    if (isTournament) return 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]';
    if (theme === 'gold') return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]';
    if (theme === 'silver') return 'bg-slate-300';
    if (theme === 'bronze') return 'bg-[#cd7f32]';
    return event.isHome ? 'bg-theme-gold' : 'bg-[#f5abb9]';
  };

  return (
    <div className="flex flex-col gap-4 relative">
        <div className="w-full bg-theme-dark border border-theme-light rounded-2xl overflow-hidden shadow-2xl shadow-black relative min-h-[400px]">
            <div 
                className="absolute inset-0 z-0 opacity-30 pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("${WEEKDAY_BG_IMAGE}")`,
                    backgroundSize: '60%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />

            {/* Header */}
            <div className={`grid border-b border-theme-light bg-theme-light/10 relative z-10 ${showWeekdays ? 'grid-cols-[0.8fr_0.8fr_0.8fr_0.8fr_0.8fr_2.5fr_2.5fr]' : 'grid-cols-[40px_1fr_1fr]'}`}>
                {showWeekdays ? (
                    <>
                        <div className="py-2 text-center text-[10px] font-black text-theme-muted uppercase">M</div>
                        <div className="py-2 text-center text-[10px] font-black text-theme-muted uppercase">T</div>
                        <div className="py-2 text-center text-[10px] font-black text-theme-muted uppercase">W</div>
                        <div className="py-2 text-center text-[10px] font-black text-theme-muted uppercase">T</div>
                        <div className="py-2 text-center text-[10px] font-black text-theme-muted uppercase">F</div>
                    </>
                ) : (
                    <div className="py-2 text-center text-[8px] font-black text-theme-muted uppercase flex items-center justify-center border-r border-theme-light/30">WKD</div>
                )}
                <div className="py-2 sm:py-3 text-center text-xs sm:text-sm font-black text-theme-gold uppercase tracking-[0.2em]">Saturday</div>
                <div className="py-2 sm:py-3 text-center text-xs sm:text-sm font-black text-theme-gold uppercase tracking-[0.2em]">Sunday</div>
            </div>

            {/* Grid Content */}
            <div className="relative z-10">
                {weeks.map((week, weekIdx) => {
                    const weekdays = week.slice(0, 5);
                    const weekend = week.slice(5, 7);
                    
                    const midweekEvents = fixtures.filter(f => 
                      weekdays.some(d => 
                        d.date.getDate() === f.date.getDate() && 
                        d.date.getMonth() === f.date.getMonth() && 
                        d.date.getFullYear() === f.date.getFullYear()
                      )
                    );

                    return (
                        <div key={weekIdx} className={`grid ${showWeekdays ? 'grid-cols-[0.8fr_0.8fr_0.8fr_0.8fr_0.8fr_2.5fr_2.5fr]' : 'grid-cols-[40px_1fr_1fr] border-b border-theme-light/30'}`}>
                            {/* Midweek Column or Cells */}
                            {showWeekdays ? (
                                weekdays.map((cell, idx) => {
                                    const isToday = cell.date.toDateString() === today.toDateString();
                                    const daysEvents = fixtures.filter(e => e.date.toDateString() === cell.date.toDateString());
                                    return (
                                        <div key={idx} className={`min-h-[90px] border-r border-theme-light/30 p-1 flex flex-col items-center gap-1 ${!cell.isCurrent ? 'opacity-20' : ''}`}>
                                            <span className={`text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ${isToday ? 'bg-theme-gold text-theme-base' : 'text-theme-muted'}`}>{cell.date.getDate()}</span>
                                            {daysEvents.map(e => (
                                                <button 
                                                    key={e.id} 
                                                    onClick={() => onEventClick(e)}
                                                    className={`w-2 h-2 rounded-full hover:scale-125 transition-transform ${getEventChipStyles(e)}`}
                                                />
                                            ))}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="border-r border-theme-light/30 bg-theme-dark/40 flex flex-col items-center gap-2 py-2">
                                    {midweekEvents.map(e => (
                                        <button 
                                            key={e.id}
                                            onClick={() => onEventClick(e)}
                                            className={`w-3 h-3 rounded-full hover:scale-125 transition-transform shrink-0 ${getEventChipStyles(e)}`}
                                            title={`${e.competition}: ${e.teamName}`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Weekend Cells */}
                            {weekend.map((cell, idx) => {
                                const isNextMonth = !cell.isCurrent && cell.date.getDate() < 15;
                                if (isNextMonth) return <div key={idx} className="min-h-[90px] border-r border-theme-light/10"></div>;

                                const isToday = cell.date.toDateString() === today.toDateString();
                                const daysEvents = fixtures.filter(e => e.date.toDateString() === cell.date.toDateString());

                                return (
                                    <div key={idx} className={`min-h-[90px] border-r border-theme-light/30 p-2 flex flex-col group ${isToday ? 'bg-theme-gold/5' : ''}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${isToday ? 'bg-theme-gold text-theme-base shadow-lg' : 'text-theme-muted group-hover:text-theme-text'}`}>
                                                {cell.date.getDate()}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            {daysEvents.map(event => {
                                                const timeStr = event.date.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'});
                                                const displayTime = timeStr === '00:00' ? 'TBC' : timeStr;
                                                const isCompleted = event.status === 'completed';
                                                const isSocial = event.competition.toLowerCase().includes('social') || event.competition === 'Club Event';
                                                const theme = getCompetitionTheme(event);

                                                let barColor = event.isHome ? 'bg-theme-gold' : 'bg-[#f5abb9]';
                                                if (isSocial) barColor = 'bg-fuchsia-600';
                                                else if (theme === 'gold') barColor = 'bg-yellow-500';

                                                return (
                                                    <button 
                                                        key={event.id}
                                                        onClick={() => onEventClick(event)}
                                                        className={`w-full text-left p-1.5 rounded-md relative overflow-hidden transition-all hover:translate-x-1 ${isSocial && !isCompleted ? 'bg-fuchsia-600/10 social-glimmer border border-fuchsia-500/20' : 'bg-white/5 hover:bg-white/10'} ${isCompleted ? 'opacity-40' : ''}`}
                                                    >
                                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${barColor}`}></div>
                                                        <div className="flex items-center gap-1.5 opacity-80 mb-0.5">
                                                            {isSocial && <PartyPopper size={8} className="text-fuchsia-400" />}
                                                            <span className="text-[8px] font-black uppercase text-theme-muted truncate">{event.competition}</span>
                                                            <span className="text-[9px] font-bold text-white ml-auto">{displayTime}</span>
                                                        </div>
                                                        <div className={`text-[10px] font-black uppercase truncate leading-none ${isSocial ? 'text-white' : (event.isHome ? 'text-theme-gold' : 'text-white')}`}>
                                                            {event.teamName}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* View Weekdays Toggle Overlay */}
        {hasHiddenWeekdayEvents && !showWeekdays && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex justify-center animate-bounce-slow">
                <button 
                    onClick={() => onShowWeekdaysChange(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-theme-gold text-theme-base rounded-full font-black uppercase text-xs tracking-widest shadow-[0_0_20px_rgba(255,209,2,0.5)] hover:scale-105 active:scale-95 transition-all border-2 border-theme-base"
                >
                    <Eye size={16} />
                    Expand Calendar View ({allHiddenWeekdayEvents.length})
                </button>
            </div>
        )}
    </div>
  );
};

export default CalendarGrid;
