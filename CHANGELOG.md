# Changelog MatchboxPro

## [2025-08-29] - PWA Layout Unification + Mobile Optimization

### 🎯 **PWA LAYOUT UNIFICATION**
- **Safe-Area Handling**: Unified safe-area CSS variables (--sat, --sab, --sal, --sar)
  - @media (display-mode: standalone) for PWA detection
  - @supports (padding: max(0px)) for iOS modern safe-area
  - Removed user-scalable=no from viewport for better accessibility
- **Bottom Navigation Overlay**: Fixed height nav with ::after pseudo-element
  - Prevents icon clipping with overlay approach for safe-area-inset-bottom
  - Unified content-wrapper class for consistent scroll behavior
  - Added -webkit-overflow-scrolling: touch for iOS performance
- **Color Normalization**: Complete CSS variables enforcement
  - Replaced all hardcoded hex colors with --brand-azzurro, --brand-giallo
  - Added color-scheme: light and text-rendering: optimizeLegibility
  - Consistent brand color usage across all components

### 📱 **MOBILE FIXES**
- **Scroll Fix**: Fixed vertical scroll in figurine lists with overflow-y: auto
- **Modal Touch**: Album statistics modal now closes on touch outside
- **Navigation Icons**: Enhanced visibility with larger icons (w-6 h-6) and drop-shadow
  - Better contrast with text-white/90 for inactive states
  - Smooth transition-colors for improved UX
  - Font-medium for enhanced text legibility

### 🔧 **CODE CLEANUP**
- **Console.log Removal**: Cleaned debug logging from production code
  - Server routes admin.ts optimized
  - ReportRepository.ts debug statements removed
  - Maintained error logging for production monitoring
- **Touch Event Unification**: Standardized onClick handlers for mobile compatibility
  - Replaced onMouseDown/onTouchStart with onClick in StickerGrid
  - Improved mobile touch responsiveness across components

### 🚀 **LAYOUT CONSISTENCY**
- **Duplicate Header Removal**: Fixed album/figurine pages showing double headers
- **Content Wrapper Unification**: Single .content-wrapper class for all pages
  - Consistent padding-bottom for bottom navigation clearance
  - Unified overflow behavior with overscroll-behavior: contain
- **PWA Standalone Priority**: PWA installed version as reference implementation
  - Identical layout between browser and PWA versions
  - iOS/Android compatibility with safe-area handling

## [Unreleased]

## [2025-08-21] - Admin Album Reordering + UI Optimizations

### 🎯 **ADMIN ALBUM MANAGEMENT**
- **Drag & Drop Reordering**: Implementato sistema completo per riordinare album nell'admin
  - Libreria @hello-pangea/dnd per esperienza drag & drop fluida
  - Icone grip per indicare elementi trascinabili
  - Effetti visivi durante il trascinamento (shadow, scale)
  - Salvataggio automatico dell'ordine tramite API
- **Persistent Order System**: Ordine album salvato in album-order.json
  - Persistenza tra riavvii server
  - Sincronizzazione automatica tra admin e app utente
  - Fallback sicuro per album non ancora ordinati
- **API Integration**: Endpoint PUT /api/admin/albums/reorder
  - Validazione input con controllo array
  - Gestione errori completa
  - Toast notifications per feedback utente

### 📱 **UI OPTIMIZATIONS**
- **Compact Sticker Grid**: Ridotta altezza box figurine del 25%
  - Da 45px a 34px per migliore utilizzo schermo
  - Spazio tra box ridotto da 4px a 2px (space-y-1 → space-y-0.5)
  - Layout più denso mantenendo leggibilità
- **Visual Feedback**: Migliorata UX durante drag & drop
  - Cursor grab/grabbing per indicare interattività
  - Hover effects su grip icons
  - Transizioni fluide durante riordinamento

### 🔧 **TECHNICAL IMPROVEMENTS**
- **Album Repository Enhancement**: Nuovo metodo getAlbumsOrdered()
  - Caricamento ordine da file system
  - Riordinamento automatico secondo preferenze admin
  - Gestione album nuovi non ancora ordinati
- **Server Configuration**: Risolti conflitti porta
  - Server configurato per porta 3001 in development
  - Eliminati conflitti con servizi esistenti
  - Registrazione corretta endpoint admin
- **Code Quality**: Pulizia completa codice
  - Rimosso logging debug da produzione
  - Eliminati file temporanei e obsoleti
  - Ottimizzata gestione errori

### 🚀 **DEPLOYMENT READY**
- **Production Clean**: Codice ottimizzato per produzione
  - Zero debug logs in output finale
  - File system integration robusta
  - Gestione errori completa per edge cases
- **Backward Compatibility**: Funzionalità esistenti preservate
  - Layout originale mantenuto
  - Nessuna breaking change per utenti finali
  - Migrazioni automatiche per ordine album

## [2025-08-20] - Ottimizzazione Completa Pulsanti SI/NO/DOPPIA + Performance Mobile

### 🎯 **OTTIMIZZAZIONE PULSANTI STICKERS**
- **Logica corretta SI/NO/DOPPIA**: Implementata regola di business corretta
  - DOPPIA attivabile solo quando SI è attivo (status "yes" o "double")
  - Verde rimane sempre attivo quando DOPPIA è attiva
  - NO disabilita completamente tutti gli altri pulsanti
- **Performance mobile ottimizzata**: Eliminato completamente il lag sui click
  - Eventi `onMouseDown` + `onTouchStart` per feedback immediato
  - Aggiornamento stato locale istantaneo con `setLocalStates`
  - API calls asincrone non bloccanti con `requestAnimationFrame`
- **CSS Hardware Acceleration**: Ottimizzazioni GPU per rendering fluido
  - `transform: translateZ(0)` e `will-change: background-color`
  - `transition: 'none'` per eliminare ritardi animazioni
  - `touchAction: 'manipulation'` per touch ottimizzato

### 📱 **PWA FULLSCREEN MOBILE**
- **Manifest fullscreen**: Cambiato da "standalone" a "fullscreen"
- **Meta tags iOS/Android**: Nascondere completamente barre browser
- **CSS viewport**: Forzare altezza 100vh e nascondere scrollbar
- **JavaScript mobile**: Auto-hide address bar e prevenzione zoom
- **Safe area support**: Compatibilità con notch e gesture area

### ⚡ **PERFORMANCE OTTIMIZZAZIONI**
- **Startup ridotto**: Animazione intro da 2.5s a 2s (-20% tempo caricamento)
- **Caching intelligente**: React Query staleTime 30s, gcTime 5min per ridurre richieste
- **Polling ottimizzato**: Chat messages da 3s a 5s per ridurre carico server
- **Timeout eliminati**: Rimossi delay inutili in pwaUtils e orientationchange
- **Debug cleanup**: Eliminati console.log di produzione per performance

### 🔧 **FIX CRITICI**
- **Problema intro**: Intro non appare più durante navigazione normale
- **Logica DOPPIA**: Tripla protezione per prevenire click non validi
- **Visualizzazione verde**: Verde rimane attivo quando DOPPIA è selezionata
- **Touch responsiveness**: Zero lag su tutti i dispositivi mobile

### 🚀 **MIGLIORAMENTI CODICE**
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
