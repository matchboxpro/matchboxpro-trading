# Changelog MatchboxPro

## [2025-08-20] - Ottimizzazioni Performance + Fix Intro

### ⚡ Ottimizzazioni Performance
- **Startup ridotto**: Animazione intro da 2.5s a 2s (-20% tempo caricamento)
- **Caching intelligente**: React Query staleTime 30s, gcTime 5min per ridurre richieste
- **Polling ottimizzato**: Chat messages da 3s a 5s per ridurre carico server
- **Timeout eliminati**: Rimossi delay inutili in pwaUtils e orientationchange
- **Debug cleanup**: Eliminati console.log di produzione per performance

### 🔧 Fix Critico Pagina Intro
- **Problema risolto**: Intro non appare più durante navigazione normale
- **Logica perfezionata**: Intro solo al primo avvio o riapertura app completa
- **Listener rimosso**: Eliminato visibilitychange che causava intro accidentale
- **Validazione preventiva**: Controllo immediato per accesso intro appropriato
- **Flag cleanup**: Pulizia automatica sessionStorage dopo uso

### 🚀 Miglioramenti Codice
- **useCallback**: Aggiunto per ottimizzare re-render componenti
- **Import corretti**: Risolti errori TypeScript mancanti
- **RefetchInterval**: Rimossi polling eccessivi (admin page)
- **Memory management**: Garbage collection ottimizzato

## [2025-08-20] - Sistema Attivazione Album + UI Miglioramenti

### ✨ Nuove Funzionalità
- **Sistema attivazione album**: Pulsanti ON/OFF per attivare/disattivare album
- **Persistenza stato album**: Gli album attivati rimangono ON anche cambiando pagina (localStorage)
- **Accesso condizionale**: Solo album attivati sono accessibili per la visualizzazione figurine
- **Sezione Account espandibile**: Nuova sezione nella pagina profilo per gestire dati account
- **Conferma cambio password**: Messaggio di conferma quando si modifica la password

### 🔧 Miglioramenti UI/UX
- **Validazione nickname migliorata**: Maiuscolo, max 8 caratteri, solo lettere e numeri (client + server)
- **Testi ridotti pagina Album**: Dimensioni ottimizzate per migliore leggibilità
- **Rimozione icone freccia**: Eliminata da pulsanti album per design più pulito
- **Pulsante ESCI ridisegnato**: Stesso layout del pulsante Account con scritta gialla
- **Navigazione Album migliorata**: Pulsante Album nella barra nav riporta sempre alla selezione principale
- **Durata intro ridotta**: Da 4 a 3 secondi per esperienza più veloce
- **Rotazione logo ridotta**: Animazione più dolce (-58% velocità rotazione)

### 🛠️ Correzioni Tecniche
- **Rimozione campo raggio ricerca**: Eliminato dalla pagina profilo (disponibile solo in Match)
- **Navigazione con eventi personalizzati**: Sistema robusto per reset album senza riavvio app
- **Gestione stato separata**: Account data separati da form data per migliore organizzazione
- **Validazione schema server**: Aggiornata per supportare nuove regole nickname

### 📱 Ottimizzazioni Mobile
- **Layout consistente**: Pulsanti Account ed Esci con design uniforme
- **Feedback visivo**: Album disattivati mostrati con opacità ridotta
- **Touch handling**: Gestione eventi touch migliorata per stabilità menu

### 🔒 Sicurezza
- **Validazione input rafforzata**: Controlli sia client che server per nickname e password
- **Gestione errori migliorata**: Messaggi di errore più informativi
- **Prevenzione accessi non autorizzati**: Solo album attivati accessibili

### 🗂️ Struttura Dati
- **localStorage per album attivi**: Persistenza locale dello stato attivazione
- **Schema database aggiornato**: Campo nickname limitato a 8 caratteri
- **Validazione Zod migliorata**: Regex aggiornata per nuove regole nickname

---

## Versioni Precedenti

### [2025-08-19] - Pagina Intro Animata + ESLint
- Pagina intro con animazioni fluide
- Integrazione ESLint completa
- Ottimizzazioni performance

### [2025-08-18] - Sistema Figurine Completo
- Pulsanti SI/NO/DOPPIA funzionanti
- API endpoints corretti
- Autenticazione JWT stabile

### [Non rilasciato]

### Aggiunto
- Sistema di attivazione album con persistenza localStorage
- Validazione nickname con controllo unicità real-time
- Pulsante "Password" nella pagina Profilo con form completo per cambio password
- Endpoint API `/api/user/change-password` per aggiornamento sicuro password
- Validazione client-side per form cambio password (lunghezza minima, conferma)
- Toast notifications per feedback utente su operazioni password
- Gestione errori migliorata con messaggi specifici per ogni scenario
- Hook `useCallback` per ottimizzazione performance componenti

### Modificato
- **PERFORMANCE**: Ridotti tempi animazione intro da 2.5s a 2s totali
- **PERFORMANCE**: Ottimizzato caching React Query (staleTime 30s, gcTime 5min)
- **PERFORMANCE**: Chat polling ridotto da 3s a 5s per ridurre carico server
- **PERFORMANCE**: Eliminati timeout inutili in pwaUtils e orientationchange
- **INTRO**: Perfezionata logica pagina intro per evitare visualizzazione durante navigazione
- **INTRO**: Rimosso listener visibilitychange per prevenire intro accidentale
- **INTRO**: Aggiunta validazione preventiva per accesso intro appropriato
- Migliorata UX della pagina Album con stato attivazione persistente
- Ottimizzata gestione stato locale per feedback immediato sui pulsanti figurine
- Aggiornata logica di selezione pulsanti SI/NO/DOPPIA per evitare selezioni multiple
- Migliorata responsività mobile con target touch ottimizzati (44x44px)
- Standardizzato layout pagine con pattern fullscreen consistente
- Ottimizzata gestione eventi touch per prevenire propagazione indesiderata

### Corretto
- **CRITICO**: Risolto problema intro mostrata durante navigazione normale
- **PERFORMANCE**: Eliminati console.log di debug da produzione
- **PERFORMANCE**: Rimossi refetchInterval eccessivi (admin page)
- Risolto problema selezione multipla pulsanti stato figurine
- Corretti errori di sintassi JSX nella pagina Match
- Corretti errori TypeScript con import useCallback mancante
- Migliorata gestione scroll e overflow su dispositivi mobile
- Ottimizzata configurazione PWA per esperienza fullscreen nativa
- Corretta gestione viewport dinamico per nascondere barre browser mobile

### Rimosso
- Console.log di debug da bottom-navigation e StickerMutations
- Timeout ridondanti in pwaUtils per migliorare velocità
- Listener visibilitychange che causava intro accidentale
- RefetchInterval non necessari per ridurre carico server

### Sicurezza
- Implementato hashing bcrypt per password con salt rounds configurabili
- Aggiunta validazione server-side per cambio password con verifica password corrente
- Migliorata gestione errori API per prevenire information disclosure

---

## Note Tecniche

### Ottimizzazioni Performance v2.1
- **Startup**: Riduzione 20% tempo caricamento iniziale
- **Caching**: Strategia intelligente per bilanciare performance/aggiornamenti
- **Mobile**: Esperienza fullscreen ottimizzata senza interferenze browser
- **Memory**: Garbage collection ottimizzato per prevenire memory leak

### Architettura
- Frontend: React 18 + TypeScript + Wouter + TanStack Query
- Backend: Express.js + Drizzle ORM + Supabase PostgreSQL
- Styling: Tailwind CSS + shadcn/ui components
- PWA: Service Worker + Manifest per esperienza nativa mobile

### Database Schema
- Tabelle principali: users, albums, stickers, user_stickers, matches, messages
- Relazioni con CASCADE DELETE per integrità referenziale
- UUID come chiavi primarie per sicurezza e scalabilità

### Deployment
- Frontend: Netlify con build automatico da GitHub
- Database: Supabase con connection pooling
- CDN: Ottimizzazione automatica asset staticizzazioni performance
