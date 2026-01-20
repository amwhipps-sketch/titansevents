import React, { useEffect, useState, useMemo, useRef } from 'react';
import Header from './components/Header';
import FixtureList from './components/FixtureList';
import EventModal from './components/EventModal';
import FeaturedMatch from './components/FeaturedMatch';
import CalendarGrid from './components/CalendarGrid';
import AdminPanel from './components/AdminPanel';
import { getFixtures, getAdminData } from './services/fixtureService';
import { Fixture, AdminStorage } from './types';
import { RefreshCw, AlertCircle, Swords, PartyPopper, Check } from 'lucide-react';

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

  // Default to false (Socials Only)
  const [showMatches, setShowMatches] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!appRef.current) return;

    const sendHeight = () => {
      if (appRef.current) {
        const height = appRef.current.getBoundingClientRect().height;
        window.parent.postMessage({ 
          type: 'titans-calendar-resize', 
          height: height 
        }, '*');
      }
    };

    sendHeight();
    const resizeObserver = new ResizeObserver(() => {
      sendHeight();
    });

    resizeObserver.observe(appRef.current);
    return () => resizeObserver.disconnect();
  }, [isAdminMode, viewMode, showFilters, showWeekdays, fixtures, isLoading]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFixtures();
      setFixtures(data);
    } catch (error) {
      console.error("Failed to fetch fixtures", error);
      setError("Unable to connect to the match schedule service.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'next') newDate.setMonth(prev.getMonth() + 1);
      else newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const { upcomingEvents, nextDayEvents } = useMemo(() => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const featuredCutoff = new Date(now.getTime() - (12 * 60 * 60 * 1000));

      const filtered = fixtures.filter(f => {
          const compLower = f.competition.toLowerCase();
          
          // Define what counts as a competitive match
          const isMatch = compLower === 'fixture' || 
                         compLower.includes('league') || 
                         compLower.includes('cup') || 
                         compLower.includes('shield') || 
                         compLower.includes('final') || 
                         compLower.includes('tournament');
          
          const isTraining = compLower.includes('training');

          // If NOT in +Fixtures mode, we hide competitive matches but KEEP Socials/Training/Events
          if (!showMatches && isMatch) return false;
          
          // Basic date filtering
          const isToday = f.date.toDateString() === now.toDateString();
          const isUpcoming = f.date >= todayStart && f.status !== 'completed';
          
          return isToday || isUpcoming;
      });

      filtered.sort((a, b) => a.date.getTime() - b.date.getTime());

      let featuredEvents: Fixture[] = [];
      const potentialFeatured = filtered.filter(f => f.date >= featuredCutoff);

      if (potentialFeatured.length > 0) {
          const nextDateStr = potentialFeatured[0].date.toDateString();
          featuredEvents = potentialFeatured.filter(f => f.date.toDateString() === nextDateStr);
      }

      return { upcomingEvents: filtered, nextDayEvents: featuredEvents };
  }, [fixtures, showMatches]);

  return (
    <div ref={appRef} className="max-w-3xl mx-auto px-4 sm:px-6 pb-12" id="app">
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

        {isLoading && (
            <div className="w-full h-96 flex items-center justify-center border border-theme-light rounded-2xl bg-theme-light/10">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-theme-gold border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-theme-muted text-sm font-bold uppercase tracking-wider">Syncing Schedule...</p>
                </div>
            </div>
        )}

        {!isLoading && error && (
             <div className="w-full flex flex-col items-center justify-center border border-theme-light rounded-2xl bg-theme-light/10 text-center p-8">
                <div className="bg-red-500/10 text-red-500 p-4 rounded-full mb-4"><AlertCircle className="w-8 h-8" /></div>
                <h3 className="text-theme-text font-bold text-xl mb-2">Connection Issue</h3>
                <button onClick={fetchData} className="flex items-center gap-2 px-6 py-3 bg-theme-gold text-theme-base rounded-lg hover:bg-theme-gold-dim transition-all font-bold uppercase tracking-wider shadow-lg"><RefreshCw className="w-4 h-4" /> Retry</button>
            </div>
        )}

        {!isLoading && !error && (
            <div className="fade-in">
                {isAdminMode ? (
                  <AdminPanel adminData={adminData} fixtures={fixtures} onDataChange={setAdminData} onRefresh={fetchData} />
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-center sm:justify-start">
                        <div className="inline-flex bg-theme-dark p-1 rounded-2xl border border-theme-light/30 shadow-inner">
                            <button 
                                onClick={() => setShowMatches(false)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${!showMatches ? 'bg-fuchsia-600 text-white shadow-lg scale-105' : 'text-theme-muted hover:text-white'}`}
                            >
                                <PartyPopper size={16} />
                                <span>Socials</span>
                                {!showMatches && <Check size={14} className="ml-1" />}
                            </button>
                            <button 
                                onClick={() => setShowMatches(true)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${showMatches ? 'bg-theme-gold text-theme-base shadow-lg scale-105' : 'text-theme-muted hover:text-white'}`}
                            >
                                <Swords size={16} />
                                <span>+ Fixtures</span>
                                {showMatches && <Check size={14} className="ml-1" />}
                            </button>
                        </div>
                    </div>

                    {viewMode === 'calendar' ? (
                        <CalendarGrid 
                            currentDate={currentDate} 
                            fixtures={upcomingEvents} 
                            onEventClick={setSelectedEvent} 
                            showWeekdays={showWeekdays} 
                            onShowWeekdaysChange={setShowWeekdays}
                        />
                    ) : (
                        <>
                            {nextDayEvents.length > 0 && (
                                <FeaturedMatch fixtures={nextDayEvents} onClick={setSelectedEvent} />
                            )}
                            <FixtureList 
                                fixtures={upcomingEvents} 
                                onEventClick={setSelectedEvent} 
                                showResultsMode={false} 
                                showFilters={showFilters}
                            />
                        </>
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
