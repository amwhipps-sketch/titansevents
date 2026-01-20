
import React from 'react';
import { Badge } from './Badge';
import { Calendar as CalendarIcon, List, ChevronLeft, ChevronRight, Eye, EyeOff, Settings, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'fixtures' | 'results' | 'admin';
  onTabChange: (tab: 'fixtures' | 'results' | 'admin') => void;
  viewMode: 'list' | 'calendar';
  onViewModeChange: (mode: 'list' | 'calendar') => void;
  showWeekdays: boolean;
  onShowWeekdaysChange: (show: boolean) => void;
  currentDate: Date;
  onMonthChange: (direction: 'prev' | 'next') => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
    activeTab, 
    onTabChange,
    viewMode,
    onViewModeChange,
    showWeekdays,
    onShowWeekdaysChange,
    currentDate,
    onMonthChange,
    isLoading
}) => {
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col gap-6 mb-8 pt-4 sm:pt-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 drop-shadow-2xl">
                    <Badge />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none italic">
                        London <span className="text-theme-gold">Titans</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-theme-muted font-bold tracking-[0.2em] uppercase mt-1">
                        Fixture Centre
                    </p>
                </div>
            </div>

            <button 
                onClick={() => onTabChange(activeTab === 'admin' ? 'fixtures' : 'admin')}
                className={`p-2.5 rounded-xl border transition-all ${
                    activeTab === 'admin' 
                    ? 'bg-theme-gold border-theme-gold text-theme-base shadow-[0_0_15px_rgba(255,209,2,0.4)]' 
                    : 'bg-theme-light border-theme-light text-theme-muted hover:text-theme-gold hover:border-theme-gold/30'
                }`}
                title="Admin Portal"
            >
                <Settings size={22} className={activeTab === 'admin' ? 'animate-spin-slow' : ''} />
            </button>
        </div>

        {activeTab !== 'admin' && (
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex bg-theme-dark p-1 rounded-xl border border-theme-light/30 w-full sm:w-auto shadow-lg">
                    <button 
                        onClick={() => onTabChange('fixtures')}
                        className={`flex-1 sm:px-6 py-2.5 rounded-lg font-black uppercase text-xs tracking-widest transition-all ${activeTab === 'fixtures' ? 'bg-theme-gold text-theme-base shadow-sm' : 'text-theme-muted hover:text-white'}`}
                    >Fixtures</button>
                    <button 
                        onClick={() => onTabChange('results')}
                        className={`flex-1 sm:px-6 py-2.5 rounded-lg font-black uppercase text-xs tracking-widest transition-all ${activeTab === 'results' ? 'bg-theme-gold text-theme-base shadow-sm' : 'text-theme-muted hover:text-white'}`}
                    >Results</button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto ml-auto">
                    <div className="flex bg-theme-dark p-1 rounded-xl border border-theme-light/30 shadow-lg">
                        <button onClick={() => onViewModeChange('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-theme-gold text-theme-base' : 'text-theme-muted hover:text-white'}`}><List size={18}/></button>
                        <button onClick={() => onViewModeChange('calendar')} className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-theme-gold text-theme-base' : 'text-theme-muted hover:text-white'}`}><CalendarIcon size={18}/></button>
                    </div>

                    {viewMode === 'calendar' && (
                        <div className="flex items-center gap-1 bg-theme-dark p-1 rounded-xl border border-theme-light/30 shadow-lg">
                            <button onClick={() => onMonthChange('prev')} className="p-2 text-theme-muted hover:text-white"><ChevronLeft size={18}/></button>
                            <span className="text-[10px] font-black uppercase tracking-wider text-white px-2 min-w-[100px] text-center">{monthName}</span>
                            <button onClick={() => onMonthChange('next')} className="p-2 text-theme-muted hover:text-white"><ChevronRight size={18}/></button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'admin' && (
             <div className="flex items-center gap-3 bg-theme-gold/10 border border-theme-gold/30 p-3 rounded-2xl animate-fadeIn">
                <ShieldCheck className="text-theme-gold" size={20}/>
                <div>
                    <h2 className="text-white font-black uppercase text-sm tracking-widest leading-none">Admin Mode</h2>
                    <p className="text-theme-gold text-[10px] font-bold uppercase tracking-widest mt-0.5">Edit mode active</p>
                </div>
             </div>
        )}
    </div>
  );
};

export default Header;
