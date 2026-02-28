import { ArrowLeft, Calendar, Clock, MapPin, Star, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Reviews } from '@/components/Reviews';
import { Event } from '@/data/mockData';

interface EventDetailsProps {
  event: Event;
  onBack: () => void;
  onBookNow: () => void;
}

export const EventDetails = ({ event, onBack, onBookNow }: EventDetailsProps) => {
  return (
    <div className="min-h-screen bg-background animate-fade-in pb-24 md:pb-0">
      {/* Hero */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        <button
          onClick={onBack}
          className="absolute top-4 left-4 md:top-6 md:left-6 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-2">
          <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Title card */}
          <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-primary text-primary-foreground">
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  </Badge>
                  {event.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-sm font-semibold">{event.rating}/10</span>
                    </div>
                  )}
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {event.title}
                </h1>
                {event.genre && <p className="text-muted-foreground">{event.genre}</p>}
              </div>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">Starting from</span>
                <p className="text-3xl font-bold text-primary">₹{event.price}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {new Date(event.date).toLocaleDateString('en-IN', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {event.time}
                {event.duration && <span>• {event.duration}</span>}
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <MapPin className="w-5 h-5 text-primary" />
              {event.venue}, {event.city}
            </div>

            {event.language && (
              <div className="mb-6">
                <Badge variant="outline">{event.language}</Badge>
              </div>
            )}

            <Button variant="hero" size="xl" className="w-full md:w-auto" onClick={onBookNow}>
              Book Tickets
            </Button>
          </div>

          {/* About */}
          <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">About this Event</h2>
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
          </div>

          {/* Venue */}
          <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">Venue Information</h2>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{event.venue}</h3>
                <p className="text-muted-foreground">{event.city}</p>
              </div>
            </div>
          </div>

          {/* ── Reviews section ── */}
          <Reviews
            targetType="event"
            targetId={event.id}
            eventTitle={event.title}
          />
        </div>
      </div>

      {/* Mobile bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border md:hidden z-40">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">Starting from</span>
            <p className="text-xl font-bold text-primary">₹{event.price}</p>
          </div>
          <Button variant="hero" size="lg" onClick={onBookNow}>Book Tickets</Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
