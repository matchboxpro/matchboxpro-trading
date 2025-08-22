# MatchboxPro - API Documentation

## 📋 Panoramica

REST API completa per gestione utenti, album, figurine, matching e segnalazioni. Costruita con Express.js + storage modulare pattern Repository.

## 🔐 Autenticazione

**JWT** con cookie HttpOnly sicuri per tutti gli endpoint protetti.

**Sicurezza**: bcrypt password hashing, JWT firmati, cookie HttpOnly/Secure/SameSite=Lax, rate limiting (30 req/10s), request deduplication (3s TTL), production logging ottimizzato

### Auth Endpoints

**`POST /api/auth/login`** - Login con nickname/password  
**`POST /api/auth/logout`** - Logout e distruzione sessione  
**`GET /api/auth/me`** - Verifica sessione + dati utente

Token JWT automaticamente impostato come cookie HttpOnly sicuro.

## 👥 Gestione Utenti

**`POST /api/user/register`** - Registrazione (nickname, password, cap)  
**`GET /api/user/profile`** - Profilo corrente (auth required)  
**`PUT /api/user/profile`** - Aggiorna profilo (cap, raggioKm, albumSelezionato)

## 🏛️ Admin Endpoints

**`GET /api/admin/users`** - Lista utenti completa (solo admin)  
**`PATCH /api/admin/users/:id/toggle-status`** - Attiva/disattiva utente  
**`GET /api/admin/stats`** - Statistiche dashboard (totalUsers, totalMatches, activeAlbums, pendingReports)  
**`GET /api/admin/reports`** - Segnalazioni con paginazione e filtri

## 📚 Album Endpoints

**`GET /api/albums`** - Lista album attivi + conteggio figurine  
**`GET /api/albums/:id`** - Dettagli album specifico  
**`POST /api/albums`** - Crea album (admin only)  
**`PUT /api/albums/:id`** - Modifica album (admin only)  
**`DELETE /api/albums/:id`** - Elimina album (admin only)  
**`PUT /api/admin/albums/reorder`** - Riordina album drag&drop (admin only)

Ordine salvato in `album-order.json` e rispettato in tutte le API.

## 🃏 Stickers Endpoints

**`GET /api/albums/:id/stickers`** - Lista figurine album  
**`POST /api/albums/:id/stickers`** - Crea singola figurina (admin only)  
**`POST /api/albums/:id/stickers/bulk`** - Import bulk figurine (admin only)  
**`PUT /api/stickers/:id`** - Modifica figurina (admin only)  
**`DELETE /api/stickers/:id`** - Elimina figurina (admin only)

## 🎯 User Collection

**`GET /api/user/stickers/:albumId`** - Stato figurine utente per album  
**`PUT /api/user/stickers/:stickerId`** - Aggiorna stato figurina

**Stati**: "yes" (posseduta), "no" (mancante), "double" (doppia)  
**Performance**: Rate limiting 30 req/10s, deduplication 3s TTL, aggiornamento ottimistico UI

## 🤝 Matching System

**`GET /api/matches`** - Lista match utente corrente  
**`GET /api/matches/potential`** - Ricerca potenziali match (query: albumId, radiusKm)  
**`POST /api/matches`** - Crea nuovo match (user2Id, albumId)

Algoritmo matching 1:1 per scambio figurine mancanti/doppie con ricerca geografica.

## 💬 Chat System

**`GET /api/matches/:id/messages`** - Messaggi match specifico  
**`POST /api/matches/:id/messages`** - Invia messaggio (content)

Sistema chat persistente per coordinare scambi tra utenti.

## 🚨 Reports System

**`GET /api/admin/reports`** - Lista segnalazioni con paginazione (query: status, priority, type, page, limit)  
**`POST /api/reports`** - Crea segnalazione automatica (type, description, page, errorDetails, url)  
**`PUT /api/reports/:id`** - Aggiorna stato segnalazione (admin only)

**`PUT /api/admin/reports/bulk-status`** - Aggiorna stato bulk segnalazioni (admin only)  
**`DELETE /api/admin/reports/bulk`** - Elimina segnalazioni bulk (admin only)

Sistema automatico per errori JS/network/API con gestione admin completa.

## 🏗️ Storage Architecture

**Pattern Repository** con storage modulare:

**UserRepository** - Auth + gestione utenti  
**AlbumRepository** - CRUD album + ordinamento  
**StickerRepository** - CRUD figurine + collezioni  
**MatchRepository** - Algoritmo matching + ricerca  
**MessageRepository** - Chat persistente  
**ReportRepository** - Segnalazioni + paginazione  
**AdminRepository** - Statistiche dashboard

**DB**: Drizzle ORM + PostgreSQL connection pool

## 🔒 Security & Status Codes

**Middleware**: `requireAuth` (JWT cookie verification), `requireAdmin` (role check)

**HTTP Status**: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error)

## 🛠️ React Query Integration

API ottimizzata per React Query con JWT cookie automatico:

```typescript
// Query example
const { data } = useQuery({
  queryKey: ['/api/albums'],
  queryFn: () => fetch('/api/albums', { credentials: 'include' }).then(r => r.json())
});

// Mutation example  
const mutation = useMutation({
  mutationFn: (data) => fetch('/api/albums', {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())
});
```

## 🩺 Diagnostic Endpoints

**`GET /api/_health`** - Health check sistema (status, DB_OK, JWT_SECRET, environment)  
**`GET /api/_seed`** - Seed utenti test (development only)  
**`GET /api/_whoami`** - Info utente corrente da JWT

---

**Ultimo aggiornamento**: 2025-08-22 - Refactoring modulare + governance compliance + bulk reports management
