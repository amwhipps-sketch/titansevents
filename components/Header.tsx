import React from 'react';
import { Badge } from './Badge';
import { Calendar as CalendarIcon, List, ChevronLeft, ChevronRight, Settings, ShieldCheck } from 'lucide-react';

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
    currentDate,
    onMonthChange
}) => {
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col gap-8 mb-10 pt-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                    <Badge />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter italic leading-none">
                        London <span className="text-theme-gold">Titans</span>
                    </h1>
                    <p className="text-[10px] text-theme-muted font-bold tracking-[0.3em] uppercase mt-2">
                        Activities & Socials
                    </p>
                </div>
            </div>

            <button 
                onClick={() => onTabChange(activeTab === 'admin' ? 'fixtures' : 'admin')}
                className={`p-3 rounded-xl border transition-all ${
                    activeTab === 'admin' 
                    ? 'bg-theme-gold border-theme-gold text-theme-base shadow-lg' 
                    : 'bg-theme-light border-white/5 text-theme-muted hover:text-white'
                }`}
            >
                <Settings size={20} />
            </button>
        </div>

        {activeTab !== 'admin' && (
            <div className="flex items-center justify-between">
                <div className="flex bg-theme-light p-1 rounded-xl border border-white/5">
                    <button onClick={() => onViewModeChange('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-theme-gold text-theme-base shadow-md' : 'text-theme-muted hover:text-white'}`}><List size={18}/></button>
                    <button onClick={() => onViewModeChange('calendar')} className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-theme-gold text-theme-base shadow-md' : 'text-theme-muted hover:text-white'}`}><CalendarIcon size={18}/></button>
                </div>

                {viewMode === 'calendar' && (
                    <div className="flex items-center gap-1 bg-theme-light p-1 rounded-xl border border-white/5">
                        <button onClick={() => onMonthChange('prev')} className="p-2 text-theme-muted hover:text-white"><ChevronLeft size={18}/></button>
                        <span className="text-[10px] font-black uppercase text-white px-3 min-w-[100px] text-center">{monthName}</span>
                        <button onClick={() => onMonthChange('next')} className="p-2 text-theme-muted hover:text-white"><ChevronRight size={18}/></button>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'admin' && (
             <div className="flex items-center gap-3 bg-theme-gold/10 border border-theme-gold/20 p-4 rounded-2xl animate-fadeIn">
                <ShieldCheck className="text-theme-gold" size={24}/>
                <div>
                    <h2 className="text-white font-black uppercase text-sm tracking-widest leading-none">Admin Panel</h2>
                    <p className="text-theme-gold text-[10px] font-bold uppercase tracking-widest mt-1">Authorized Access</p>
                </div>
             </div>
        )}
    </div>
  );
};

export default Header;
