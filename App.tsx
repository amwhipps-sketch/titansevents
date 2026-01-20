import React, { useEffect, useState, useMemo, useRef } from 'react';
import Header from './components/Header';
import FixtureList from './components/FixtureList';
import EventModal from './components/EventModal';
import FeaturedMatch from './components/FeaturedMatch';
import CalendarGrid from './components/CalendarGrid';
import AdminPanel from './components/AdminPanel';
import { getFixtures, getAdminData } from './services/fixtureService';
import { Fixture, AdminStorage } from './types';
import { RefreshCw, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [adminData, setAdminData] = useState<AdminStorage>(getAdminData());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showWeekdays, setShowWeekdays] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Fixture | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const appRef = useRef<HTMLDivElement>(null);

  // Auto-resize for parent iframe
  useEffect(() => {
    if (!appRef.current) return;
    const sendHeight = () => {
      if (appRef.current) {
        window.parent.postMessage({ 
          type: 'titans-calendar-resize', 
          height: appRef.current.getBoundingClientRect().height 
        }, '*');
      }
    };
    sendHeight();
    const ro = new ResizeObserver(sendHeight);
    ro.observe(appRef.current);
    return () => ro.disconnect();
  }, [isAdminMode, viewMode, fixtures, isLoading]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFixtures();
      setFixtures(data);
    } catch (e) {
      setError("Unable to sync club activities.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return d;
    });
  };

  const { upcomingEvents, featuredEvents } = useMemo(() => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const featureLimit = new Date(now.getTime() - (12 * 60 * 60 * 1000));

      const filtered = fixtures.filter(f => {
          const comp = f.competition.toLowerCase();
          
          const isMatch = comp === 'fixture' || comp.includes('league') || comp.includes('cup') || comp.includes('shield');
          if (isMatch) return false;

          const isToday = f.date.toDateString() === now.toDateString();
          const isUpcoming = f.date >= todayStart;
          
          return isToday || isUpcoming;
      });

      filtered.sort((a, b) => a.date.getTime() - b.date.getTime());

      let featured: Fixture[] = [];
      const potential = filtered.filter(f => f.date >= featureLimit);
      if (potential.length > 0) {
          const nextDate = potential[0].date.toDateString();
          featured = potential.filter(f => f.date.toDateString() === nextDate);
      }

      return { upcomingEvents: filtered, featuredEvents: featured };
  }, [fixtures]);

  return (
    <div ref={appRef} className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-4 sm:py-8 overflow-x-hidden" id="app">
        <Header 
          activeTab={isAdminMode ? 'admin' : 'fixtures'}
          onTabChange={(tab) => setIsAdminMode(tab === 'admin')}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showWeekdays={showWeekdays}
          onShowWeekdaysChange={setShowWeekdays}
          currentDate={currentDate}
          onMonthChange={handleMonthChange}
          isLoading={isLoading}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-white/5">
                <div className="w-6 h-6 border-2 border-theme-gold border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-theme-muted text-[10px] font-bold uppercase tracking-widest">Loading Club Schedule...</p>
            </div>
        ) : error ? (
            <div className="text-center p-12 bg-red-500/5 border border-red-500/20 rounded-2xl">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                <p className="text-white font-bold mb-4">{error}</p>
                <button onClick={fetchData} className="px-6 py-2 bg-theme-gold text-theme-base rounded-lg font-bold uppercase text-xs"><RefreshCw className="inline w-3 h-3 mr-2" /> Retry</button>
            </div>
        ) : (
            <div className="fade-in w-full">
                {isAdminMode ? (
                  <AdminPanel adminData={adminData} fixtures={fixtures} onDataChange={setAdminData} onRefresh={fetchData} />
                ) : (
                  <div className="space-y-8 w-full">
                    {viewMode === 'calendar' ? (
                        <CalendarGrid 
                            currentDate={currentDate} 
                            fixtures={upcomingEvents} 
                            onEventClick={setSelectedEvent} 
                            showWeekdays={showWeekdays} 
                            onShowWeekdaysChange={setShowWeekdays}
                        />
                    ) : (
                        <div className="w-full">
                            {featuredEvents.length > 0 && (
                                <FeaturedMatch fixtures={featuredEvents} onClick={setSelectedEvent} />
                            )}
                            <FixtureList 
                                fixtures={upcomingEvents} 
                                onEventClick={setSelectedEvent} 
                                showResultsMode={false} 
                                showFilters={showFilters}
                            />
                        </div>
                    )}
                  </div>
                )}
            </div>
        )}

        {selectedEvent && <EventModal fixture={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
};

export default App;
