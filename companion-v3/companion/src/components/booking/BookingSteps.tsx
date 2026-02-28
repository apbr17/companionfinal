import { Check } from 'lucide-react';

interface BookingStepsProps {
  currentStep: number;
  showCompanionStep: boolean;
  isMovie: boolean;
}

export const BookingSteps = ({ currentStep, showCompanionStep, isMovie }: BookingStepsProps) => {
  const steps = [
    { id: 1, label: 'Tickets' },
    ...(showCompanionStep ? [{ id: 2, label: 'Companion' }] : []),
    ...(isMovie ? [{ id: showCompanionStep ? 3 : 2, label: 'Seats' }] : []),
    { id: showCompanionStep ? (isMovie ? 4 : 3) : (isMovie ? 3 : 2), label: 'Checkout' },
  ];

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`step-indicator ${
                currentStep > index + 1
                  ? 'completed'
                  : currentStep === index + 1
                  ? 'active'
                  : 'pending'
              }`}
            >
              {currentStep > index + 1 ? (
                <Check className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={`text-xs mt-2 ${
                currentStep >= index + 1
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 md:w-16 h-0.5 mx-2 ${
                currentStep > index + 1 ? 'bg-primary' : 'bg-border'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
