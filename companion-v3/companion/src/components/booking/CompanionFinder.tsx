import { useState } from 'react';
import { Heart, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { companions, Companion } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

interface CompanionFinderProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  selectedCompanion: Companion | null;
  onCompanionSelect: (companion: Companion | null) => void;
  onNext: () => void;
  onBack: () => void;
}

const genderOptions = ['Any', 'Male', 'Female'];
const ageRanges = ['18-25', '26-35', '36-45', '45+'];

export const CompanionFinder = ({
  enabled,
  onEnabledChange,
  selectedCompanion,
  onCompanionSelect,
  onNext,
  onBack,
}: CompanionFinderProps) => {
  const [genderFilter, setGenderFilter] = useState('Any');
  const [ageFilter, setAgeFilter] = useState('Any');

  const filteredCompanions = companions.filter((companion) => {
    if (genderFilter !== 'Any' && companion.gender !== genderFilter.toLowerCase()) {
      return false;
    }
    if (ageFilter !== 'Any') {
      const [min, max] = ageFilter.split('-').map(Number);
      if (ageFilter === '45+') {
        if (companion.age < 45) return false;
      } else if (companion.age < min || companion.age > max) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">
        Find a Companion
      </h2>

      {/* Enable Toggle */}
      <div className="bg-muted rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Enable Companion Matching
            </h3>
            <p className="text-sm text-muted-foreground">
              Find someone with similar interests to attend with
            </p>
          </div>
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </div>
      </div>

      {enabled && (
        <>
          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">
                Preferred Gender
              </h4>
              <div className="flex gap-2">
                {genderOptions.map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setGenderFilter(gender)}
                    className={`filter-chip ${genderFilter === gender ? 'active' : ''}`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">
                Age Range
              </h4>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setAgeFilter('Any')}
                  className={`filter-chip ${ageFilter === 'Any' ? 'active' : ''}`}
                >
                  Any
                </button>
                {ageRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setAgeFilter(range)}
                    className={`filter-chip ${ageFilter === range ? 'active' : ''}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Companion Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {filteredCompanions.map((companion) => (
              <div
                key={companion.id}
                onClick={() =>
                  onCompanionSelect(
                    selectedCompanion?.id === companion.id ? null : companion
                  )
                }
                className={`companion-card ${
                  selectedCompanion?.id === companion.id ? 'selected' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={companion.avatar}
                    alt={companion.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-foreground">
                        {companion.name}
                      </h4>
                      {selectedCompanion?.id === companion.id && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {companion.age} years • {companion.gender.charAt(0).toUpperCase() + companion.gender.slice(1)}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {companion.bio}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {companion.interests.map((interest) => (
                        <Badge
                          key={interest}
                          variant="secondary"
                          className="text-xs"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCompanions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No companions match your filters</p>
            </div>
          )}
        </>
      )}

      <div className="flex gap-4">
        <Button variant="outline" size="lg" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button variant="hero" size="lg" className="flex-1" onClick={onNext}>
          {enabled ? 'Continue with Companion' : 'Skip & Continue'}
        </Button>
      </div>
    </div>
  );
};
