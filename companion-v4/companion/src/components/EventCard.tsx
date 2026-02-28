import { Calendar, Clock, MapPin, Star } from 'lucide-react';
import { Event } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export const EventCard = ({ event, onClick }: EventCardProps) => {
  const categoryColors: Record<string, string> = {
    movies: 'bg-primary',
    concerts: 'bg-purple-500',
    sports: 'bg-green-500',
    comedy: 'bg-yellow-500',
    live: 'bg-blue-500',
  };

  return (
    <div
      className="event-card cursor-pointer group"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Category Badge */}
        <Badge 
          className={`absolute top-3 left-3 ${categoryColors[event.category]} text-white border-0 text-xs font-medium`}
        >
          {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
        </Badge>

        {/* Rating */}
        {event.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 fill-accent text-accent" />
            <span className="text-white text-xs font-semibold">{event.rating}</span>
          </div>
        )}

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-display text-lg font-semibold mb-2 line-clamp-2">
            {event.title}
          </h3>
          {event.genre && (
            <p className="text-white/70 text-sm mb-2">{event.genre}</p>
          )}
          {event.language && (
            <Badge variant="outline" className="text-white/90 border-white/30 text-xs">
              {event.language}
            </Badge>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{new Date(event.date).toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          })}</span>
          <Clock className="w-4 h-4 text-primary ml-2" />
          <span>{event.time}</span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="line-clamp-1">{event.venue}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <span className="text-xs text-muted-foreground">Starting from</span>
            <p className="text-lg font-bold text-foreground">₹{event.price}</p>
          </div>
          <span className="text-primary text-sm font-semibold group-hover:underline">
            Book Now →
          </span>
        </div>
      </div>
    </div>
  );
};
