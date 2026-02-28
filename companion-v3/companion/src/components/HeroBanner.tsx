import { ArrowRight, Users, Ticket, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  onExplore: () => void;
}

export const HeroBanner = ({ onExplore }: HeroBannerProps) => {
  return (
    <section className="relative overflow-hidden gradient-dark py-16 md:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Experience Events
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Together
            </span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl mb-8 max-w-xl">
            Discover movies, concerts, sports, and more. Find your perfect companion 
            to share unforgettable moments.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Button variant="hero" size="xl" onClick={onExplore}>
              Explore Events
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
              How It Works
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Ticket className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-white/50 text-sm">Events</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-white/50 text-sm">Users</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-white/50 text-sm">Matches</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
