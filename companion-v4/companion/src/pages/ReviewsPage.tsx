import { useState } from 'react';
import { ArrowLeft, Star, MessageSquare, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Reviews } from '@/components/Reviews';
import { events } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

type Tab = 'site' | 'events';

const ReviewsPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('site');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const selectedEventData = selectedEvent
    ? events.find((e) => e.id === selectedEvent)
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Reviews</h1>
            <p className="text-xs text-muted-foreground">What our users are saying</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Tab switcher */}
        <div className="flex gap-2 mb-8 bg-muted p-1 rounded-xl w-fit">
          <button
            onClick={() => { setTab('site'); setSelectedEvent(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === 'site'
                ? 'bg-card shadow text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Globe className="w-4 h-4" />
            Site Reviews
          </button>
          <button
            onClick={() => setTab('events')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === 'events'
                ? 'bg-card shadow text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Star className="w-4 h-4" />
            Event Reviews
          </button>
        </div>

        {/* Site reviews tab */}
        {tab === 'site' && (
          <Reviews targetType="website" />
        )}

        {/* Event reviews tab */}
        {tab === 'events' && (
          <>
            {!selectedEvent ? (
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-5">
                  Select an Event
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {events.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event.id)}
                      className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 text-left hover:border-primary/40 hover:shadow-md transition-all group"
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-16 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {event.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{event.venue}</p>
                        <Badge variant="secondary" className="text-xs mt-2 capitalize">
                          {event.category}
                        </Badge>
                      </div>
                      <MessageSquare className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to all events
                </button>

                {/* Selected event mini-card */}
                {selectedEventData && (
                  <div className="flex items-center gap-4 bg-muted rounded-2xl p-4 mb-6">
                    <img
                      src={selectedEventData.image}
                      alt={selectedEventData.title}
                      className="w-14 h-18 rounded-lg object-cover flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-display font-bold text-foreground">
                        {selectedEventData.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedEventData.venue} · {selectedEventData.city}
                      </p>
                    </div>
                  </div>
                )}

                <Reviews
                  targetType="event"
                  targetId={selectedEvent}
                  eventTitle={selectedEventData?.title}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
