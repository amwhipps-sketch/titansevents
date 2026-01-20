import React, { useMemo } from 'react';
import { Fixture } from '../types';
import { MapPin, PartyPopper, Zap, Swords, Calendar } from 'lucide-react';

interface FixtureListProps {
  fixtures: Fixture[];
  onEventClick: (fixture: Fixture) => void;
  showResultsMode: boolean; 
  showFilters: boolean;
}

const FixtureList: React.FC<FixtureListProps> = ({ fixtures, onEventClick }) => {
  const grouped = useMemo(() => {
    const groups: Record<string, Fixture[]> = {};
    fixtures.forEach(item => {
      const key = item.date.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [fixtures]);

  if (fixtures.length === 0) {
      return (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
              <Calendar className="mx-auto text-theme-muted mb-4" size={32} />
              <p className="text-theme-muted font-bold text-sm uppercase tracking-widest">No activities scheduled</p>
          </div>
      );
  }

  return (
    <div className="space-y-12">
      {/* Fix: Explicitly cast Object.entries result to [string, Fixture[]][] to ensure 'items' is not inferred as 'unknown' */}
      {(Object.entries(grouped) as [string, Fixture[]][]).map(([month, items]) => (
        <div key={month}>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-white/5 flex-grow"></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-theme-muted">{month}</h3>
            <div className="h-px bg-white/5 flex-grow"></div>
          </div>

          <div className="grid gap-3">
            {items.map((item) => {
               const comp = item.competition.toLowerCase();
               const isSocial = comp.includes('social') || comp === 'club event';
               const isTraining = comp.includes('training');
               const isTournament = comp.includes('tournament');
               
               let rowClass = "bg-theme-light border-white/5";
               let badgeColor = "bg-theme-gold text-theme-base";
               let icon = <PartyPopper size={10} />;

               if (isSocial) {
                   rowClass = "bg-starlight border-white/10";
                   badgeColor = "bg-fuchsia-600 text-white";
               } else if (isTraining) {
                   rowClass = "bg-training border-white/10";
                   badgeColor = "bg-blue-600 text-white";
                   icon = <Zap size={10} />;
               } else if (isTournament) {
                   rowClass = "bg-indigo-950/50 border-white/10";
                   badgeColor = "bg-indigo-600 text-white";
                   icon = <Swords size={10} />;
               }

               const day = item.date.toLocaleDateString('en-GB', { day: 'numeric', weekday: 'short' });
               const time = item.date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

               return (
                 <button 
                    key={item.id}
                    onClick={() => onEventClick(item)}
                    className={`w-full text-left rounded-xl border p-4 flex items-center gap-4 transition-all hover:-translate-y-0.5 active:scale-[0.98] ${rowClass}`}
                 >
                    <div className="flex flex-col items-center justify-center min-w-[50px] border-r border-white/5 pr-4 shrink-0">
                        <span className="text-[10px] font-black uppercase text-theme-muted">{day.split(' ')[0]}</span>
                        <span className="text-xl font-black text-white">{day.split(' ')[1]}</span>
                    </div>

                    <div className="flex-grow min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-1.5">
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase flex items-center gap-1 shrink-0 ${badgeColor}`}>
                                {icon} {isSocial ? 'SOCIAL' : isTraining ? 'TRAINING' : isTournament ? 'TOURNAMENT' : 'EVENT'}
                            </span>
                            <span className="text-[9px] font-black uppercase text-white/40 tracking-wider break-words">{item.competition}</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black uppercase text-white leading-tight break-words">
                            {item.teamName}
                        </h4>
                    </div>

                    <div className="text-right shrink-0">
                        <div className="text-white font-black text-sm mb-0.5">{time === '00:00' ? 'TBC' : time}</div>
                        <div className="text-theme-muted text-[10px] font-bold uppercase truncate max-w-[80px]">
                            {item.location.split(',')[0]}
                        </div>
                    </div>
                 </button>
               );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FixtureList;
