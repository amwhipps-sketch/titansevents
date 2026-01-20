import React from 'react';
import { Fixture } from '../types';
import { MapPin, CalendarDays, PartyPopper, Sparkles, Swords, Zap } from 'lucide-react';

interface FeaturedMatchProps {
  fixtures: Fixture[];
  onClick: (fixture: Fixture) => void;
}

const FeaturedMatch: React.FC<FeaturedMatchProps> = ({ fixtures, onClick }) => {
  if (!fixtures || fixtures.length === 0) return null;

  const dateStr = fixtures[0].date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 bg-theme-gold"></div>
        <h3 className="text-white font-black uppercase tracking-widest text-[10px] sm:text-xs">Happening Today / Next</h3>
      </div>
      
      <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-theme-dark">
        <div className="bg-white/5 p-3 flex justify-center items-center border-b border-white/5">
            <div className="flex items-center gap-2 text-theme-muted">
                <CalendarDays size={14} className="text-theme-gold" />
                <span className="text-[10px] font-black uppercase tracking-widest">{dateStr}</span>
            </div>
        </div>

        <div className="flex flex-col divide-y divide-white/5">
          {fixtures.map((item) => {
             const comp = item.competition.toLowerCase();
             const isSocial = comp.includes('social') || comp === 'club event';
             const isTraining = comp.includes('training');
             const isTournament = comp.includes('tournament');
             
             const timeStr = item.date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

             let bgClass = "hover:bg-white/5";
             let icon = <PartyPopper size={12} />;
             let label = "CLUB EVENT";

             if (isSocial) {
                 bgClass = "bg-starlight hover:opacity-90";
                 label = "SOCIAL";
             } else if (isTraining) {
                 bgClass = "bg-training hover:opacity-90";
                 icon = <Zap size={12} />;
                 label = "TRAINING";
             } else if (isTournament) {
                 bgClass = "bg-indigo-950 hover:opacity-90";
                 icon = <Swords size={12} />;
                 label = "TOURNAMENT";
             }

             return (
                <button 
                  key={item.id}
                  onClick={() => onClick(item)}
                  className={`w-full p-8 sm:p-12 relative flex flex-col items-center justify-center transition-all duration-300 text-center ${bgClass}`}
                >
                    {isSocial && <Sparkles className="absolute top-4 right-4 text-white/10" size={48} />}
                    
                    <span className="mb-4 px-2 py-0.5 rounded bg-black/40 text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/10">
                        {icon} {label}
                    </span>
                    
                    <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-6 leading-tight max-w-lg">
                        {item.teamName}
                    </h2>

                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-theme-gold text-theme-base px-6 py-1 rounded-sm transform -skew-x-12 font-black text-xl shadow-lg">
                            {timeStr === '00:00' ? 'TBC' : timeStr}
                        </div>
                        <div className="flex items-center gap-1.5 text-white/50 text-[10px] font-bold uppercase tracking-wide">
                            <MapPin size={10} className="text-theme-gold" />
                            <span>{item.location.split(',')[0]}</span>
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
