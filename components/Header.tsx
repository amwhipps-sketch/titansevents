
import React from 'react';
import { Badge } from './Badge';
import { Calendar as CalendarIcon, List, ChevronLeft, ChevronRight, Settings, ShieldCheck, Filter } from 'lucide-react';

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
  showFilters: boolean;
  onToggleFilters: () => void;
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
    isLoading,
    showFilters,
    onToggleFilters
}) => {
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col gap-6 mb-8 pt-4 sm:pt-6">
        {/* Top Brand Bar */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 drop-shadow-2xl">
                    <Badge />
                </div>
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none italic truncate">
                        London <span className="text-theme-gold">Titans</span>
                    </h1>
                    <p className="text-[10px] sm:text-xs text-theme-muted font-bold tracking-[0.2em] uppercase mt-1 truncate">
                        Upcoming Events
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
            <div className="flex items-center gap-4 w-full">
                <div className="flex items-center gap-2 w-full">
                    <div className="flex bg-theme-dark p-1 rounded-xl border border-theme-light/30 shadow-lg">
                        <button onClick={() => onViewModeChange('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-theme-gold text-theme-base' : 'text-theme-muted hover:text-white'}`}><List size={18}/></button>
                        <button onClick={() => onViewModeChange('calendar')} className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-theme-gold text-theme-base' : 'text-theme-muted hover:text-white'}`}><CalendarIcon size={18}/></button>
                    </div>

                    <button 
                        onClick={onToggleFilters} 
                        className={`p-2 rounded-xl border transition-all shadow-lg ${showFilters ? 'bg-theme-gold border-theme-gold text-theme-base' : 'bg-theme-dark border-theme-light/30 text-theme-muted hover:text-white'}`}
                        title="Toggle Search & Filters"
                    >
                        <Filter size={18} />
                    </button>

                    {viewMode === 'calendar' && (
                        <div className="flex items-center gap-1 bg-theme-dark p-1 rounded-xl border border-theme-light/30 shadow-lg ml-auto">
                            <button onClick={() => onMonthChange('prev')} className="p-2 text-theme-muted hover:text-white"><ChevronLeft size={18}/></button>
                            <span className="text-[10px] font-black uppercase tracking-wider text-white px-2 min-w-[80px] sm:min-w-[100px] text-center">{monthName}</span>
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
                    <p className="text-theme-gold text-[10px] font-bold uppercase tracking-widest mt-0.5">Authorized Session</p>
                </div>
             </div>
        )}
    </div>
  );
};

export default Header;
