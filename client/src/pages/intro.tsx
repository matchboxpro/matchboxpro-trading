import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Intro() {
  const [, setLocation] = useLocation();
  const [showLogo, setShowLogo] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Mostra il logo con un piccolo delay per l'animazione
    const showTimer = setTimeout(() => {
      setShowLogo(true);
    }, 300);

    // Segna animazione come completata dopo 3.9 secondi (300ms delay + 3600ms transition)
    const animationTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 3900);

    // Reindirizza alla dashboard dopo 4 secondi
    const redirectTimer = setTimeout(() => {
      localStorage.setItem('hasSeenIntro', 'true');
      setLocation('/dashboard');
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(animationTimer);
      clearTimeout(redirectTimer);
    };
  }, [setLocation]);

  return (
    <div className="h-screen bg-brand-azzurro flex items-center justify-center overflow-hidden">
      <div 
        className={`${
          animationComplete 
            ? '' 
            : 'transition-all ease-out transform'
        } ${
          showLogo 
            ? 'opacity-100 scale-100 rotate-0' 
            : 'opacity-0 scale-75 -rotate-12'
        }`}
        style={{
          transitionDuration: animationComplete ? '0ms' : '3600ms'
        }}
      >
        <img 
          src="/matchbox-logo.png" 
          alt="MATCHBOX" 
          className="w-48 h-auto"
        />
      </div>
    </div>
  );
}
