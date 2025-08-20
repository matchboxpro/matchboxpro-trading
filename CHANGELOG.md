# Changelog MatchboxPro

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
