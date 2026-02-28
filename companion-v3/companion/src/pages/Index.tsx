import { useState, useMemo, useRef } from 'react';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { CategoryTabs } from '@/components/CategoryTabs';
import { EventFilters } from '@/components/EventFilters';
import { EventGrid } from '@/components/EventGrid';
import { EventDetails } from '@/pages/EventDetails';
import { Booking } from '@/pages/Booking';
import { Reviews } from '@/components/Reviews';
import { events, Event } from '@/data/mockData';

type View = 'home' | 'details' | 'booking';

const Index = () => {
  const [view, setView] = useState<View>('home');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Filters
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  const eventsRef = useRef<HTMLDivElement>(null);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // City filter
      if (event.city !== selectedCity) return false;
      
      // Search filter
      if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (activeCategory !== 'all' && event.category !== activeCategory) {
        return false;
      }
      
      // Date filter
      if (selectedDate) {
        const eventDate = new Date(event.date);
        if (
          eventDate.getDate() !== selectedDate.getDate() ||
          eventDate.getMonth() !== selectedDate.getMonth() ||
          eventDate.getFullYear() !== selectedDate.getFullYear()
        ) {
          return false;
        }
      }
      
      // Language filter
      if (selectedLanguage !== 'All' && event.language !== selectedLanguage) {
        return false;
      }
      
      return true;
    });
  }, [selectedCity, searchQuery, activeCategory, selectedDate, selectedLanguage]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setView('details');
    window.scrollTo(0, 0);
  };

  const handleBookNow = () => {
    setView('booking');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    if (view === 'booking') {
      setView('details');
    } else {
      setView('home');
      setSelectedEvent(null);
    }
    window.scrollTo(0, 0);
  };

  const handleExplore = () => {
    eventsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (view === 'booking' && selectedEvent) {
    return <Booking event={selectedEvent} onClose={handleBack} />;
  }

  if (view === 'details' && selectedEvent) {
    return (
      <EventDetails
        event={selectedEvent}
        onBack={handleBack}
        onBookNow={handleBookNow}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <HeroBanner onExplore={handleExplore} />
      
      <div ref={eventsRef}>
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        <EventFilters
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
        
        <EventGrid events={filteredEvents} onEventClick={handleEventClick} />
      </div>

      {/* Site Reviews */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Reviews targetType="website" />
      </div>

      {/* Footer */}
      <footer className="gradient-dark py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-hero rounded-xl flex items-center justify-center">
                <span className="text-xl">🎭</span>
              </div>
              <span className="font-display text-xl font-bold text-white">
                Companion
              </span>
            </div>
            <p className="text-white/50 text-sm">
              © 2026 Companion. Experience events together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
