import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Intro() {
  const [, setLocation] = useLocation();
  const [showLogo, setShowLogo] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Verifica che siamo davvero nella pagina intro per motivi validi
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    const shouldShowIntroOnAppStart = sessionStorage.getItem('showIntroOnReturn');
    
    // Se non dovremmo essere qui (navigazione accidentale), esci subito
    if (hasSeenIntro && !shouldShowIntroOnAppStart) {
      fetch('/api/auth/me', { credentials: 'include' })
        .then(res => res.ok ? setLocation('/dashboard') : setLocation('/login'))
        .catch(() => setLocation('/login'));
      return;
    }

    // Mostra il logo immediatamente
    setShowLogo(true);

    // Segna animazione come completata dopo 1.5 secondi
    const animationTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1500);

    // Reindirizza dopo 2 secondi
    const redirectTimer = setTimeout(() => {
      localStorage.setItem('hasSeenIntro', 'true');
      sessionStorage.removeItem('showIntroOnReturn'); // Pulisci il flag
      
      // Controlla se l'utente è autenticato
      fetch('/api/auth/me', { credentials: 'include' })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Not authenticated');
        })
        .then(user => {
          // Se autenticato, vai alla dashboard
          setLocation('/dashboard');
        })
        .catch(() => {
          // Se non autenticato, vai al login
          setLocation('/login');
        });

    }, 2000);

    return () => {
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
            : 'opacity-0 scale-75 -rotate-[5.04deg]'
        }`}
        style={{
          transitionDuration: animationComplete ? '0ms' : '2600ms'
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
