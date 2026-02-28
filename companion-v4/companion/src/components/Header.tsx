import { useState } from 'react';
import { Search, MapPin, Menu, X, User, LogOut, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cities } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HeaderProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header = ({ selectedCity, onCityChange, searchQuery, onSearchChange }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 gradient-hero rounded-xl flex items-center justify-center">
              <span className="text-xl">🎭</span>
            </div>
            <span className="font-display text-xl md:text-2xl font-bold text-foreground">
              Companion
            </span>
          </div>

          {/* Desktop Search + City */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-2xl mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events, movies, shows..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-11 pl-12 pr-4 bg-muted rounded-xl border-0 focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground outline-none transition-all"
              />
            </div>
            <Select value={selectedCity} onValueChange={onCityChange}>
              <SelectTrigger className="w-40 h-11 bg-muted border-0 rounded-xl">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Reviews link */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/reviews')}
            >
              <Star className="w-4 h-4" />
              Reviews
            </Button>

            {isLoggedIn ? (
              <>
                <div className="hidden md:flex items-center gap-2 ml-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-semibold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{user?.firstName}</span>
                </div>
                <Button variant="ghost" size="sm" className="hidden md:flex gap-1.5" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="w-5 h-5" />
                </Button>
                <Button variant="hero" size="sm" className="hidden md:flex" onClick={() => navigate('/signin')}>
                  Sign In
                </Button>
              </>
            )}

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-slide-up space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-muted rounded-xl border-0 focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
            <Select value={selectedCity} onValueChange={onCityChange}>
              <SelectTrigger className="w-full h-12 bg-muted border-0 rounded-xl">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => { navigate('/reviews'); setMobileMenuOpen(false); }}
            >
              <Star className="w-4 h-4" /> Reviews
            </Button>
            {isLoggedIn ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground px-1">
                  Signed in as <span className="font-medium text-foreground">{user?.firstName} {user?.lastName}</span>
                </p>
                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="hero" className="w-full" onClick={() => { navigate('/signin'); setMobileMenuOpen(false); }}>
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
