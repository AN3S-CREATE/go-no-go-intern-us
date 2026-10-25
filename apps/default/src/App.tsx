import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import { NeuroLogixLanding } from './components/NeuroLogixLanding';
import { OnboardingInternUs } from './components/OnboardingInternUs';
import { SwipeDeck } from './components/SwipeDeck';
import { useAppStore } from './store/useAppStore';
import { allFeatures } from './data/internUsFeatures';

const App: React.FC = () => {
  const { hasAcceptedNeuroLogix, hasCompletedOnboarding, setHasAcceptedNeuroLogix, setInnovations } = useAppStore();

  // Load feature data on mount
  useEffect(() => {
    setInnovations(allFeatures);
  }, [setInnovations]);

  const handleNeuroLogixAccept = () => {
    setHasAcceptedNeuroLogix(true);
  };

  // Screen flow: NeuroLogix Landing → Onboarding → Swipe Deck
  const renderScreen = () => {
    if (!hasAcceptedNeuroLogix) {
      return <NeuroLogixLanding onAccept={handleNeuroLogixAccept} />;
    }
    
    if (!hasCompletedOnboarding) {
      return <OnboardingInternUs />;
    }
    
    return <SwipeDeck />;
  };

  return (
    <>
      {renderScreen()}
      <Toaster position="top-center" />
    </>
  );
};

export default App;
