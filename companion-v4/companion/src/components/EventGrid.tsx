import { Event } from '@/data/mockData';
import { EventCard } from './EventCard';

interface EventGridProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export const EventGrid = ({ events, onEventClick }: EventGridProps) => {
  if (events.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">🎭</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No events found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {events.map((event, index) => (
          <div 
            key={event.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <EventCard event={event} onClick={() => onEventClick(event)} />
          </div>
        ))}
      </div>
    </div>
  );
};
