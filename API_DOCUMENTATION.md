# MatchboxPro - Documentazione API

## 📋 Panoramica

MatchboxPro espone una REST API completa per la gestione di utenti, album, figurine, matching e segnalazioni. L'API è costruita con Express.js e utilizza un sistema storage modulare basato su pattern Repository.

## 🔐 Autenticazione

L'API utilizza **JWT (JSON Web Tokens)** con cookie HttpOnly sicuri per l'autenticazione. Tutti gli endpoint protetti richiedono un token JWT valido.

### Sicurezza
- Password hashate con **bcrypt**
- Token JWT firmati con secret sicuro
- Cookie HttpOnly, Secure, SameSite=Lax
- Trust proxy abilitato per deployment su Render
- **Rate limiting**: 30 richieste/10s su `/api/user/stickers`
- **Request deduplication**: Cache LRU 3s TTL per anti-spam
- **Production logging**: Solo errori (≥400) e richieste lente

### Endpoints Autenticazione

#### `POST /api/auth/login`
Login utente con nickname e password.

**Request Body:**
```json
{
  "nickname": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "nickname": "string",
    "role": "user|admin"
  }
}
```

**Note**: Il token JWT viene automaticamente impostato come cookie HttpOnly sicuro.

#### `POST /api/auth/logout`
Logout utente e distruzione sessione.

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

#### `GET /api/auth/me`
Verifica sessione corrente e restituisce dati utente.

**Response (200):**
```json
{
  "id": "uuid",
  "nickname": "string",
  "cap": "string",
  "raggioKm": "number",
  "albumSelezionato": "uuid|null",
  "role": "user|admin"
}
```

## 👥 Gestione Utenti

### `POST /api/user/register`
Registrazione nuovo utente.

**Request Body:**
```json
{
  "nickname": "string",
  "password": "string",
  "cap": "string"
}
```

### `GET /api/user/profile`
Profilo utente corrente (richiede autenticazione).

### `PUT /api/user/profile`
Aggiornamento profilo utente.

**Request Body:**
```json
{
  "cap": "string",
  "raggioKm": "number",
  "albumSelezionato": "uuid"
}
```

## 🏛️ Admin - Gestione Utenti

### `GET /api/admin/users`
Lista completa utenti registrati (solo admin).

**Response (200):**
```json
[
  {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "created_at": "datetime",
    "last_login": "datetime",
    "is_active": "boolean"
  }
]
```

### `PATCH /api/admin/users/:id/toggle-status`
Attiva/disattiva stato utente (solo admin).

**Request Body:**
```json
{
  "is_active": "boolean"
}
```

## 📊 Admin - Statistiche

### `GET /api/admin/stats`
Statistiche dashboard amministratore.

**Response (200):**
```json
{
  "totalUsers": "number",
  "totalMatches": "number", 
  "activeAlbums": "number",
  "pendingReports": "number"
}
```

## 📚 Gestione Album

### `GET /api/albums`
Lista album attivi con conteggio figurine.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "year": "number",
    "isActive": "boolean",
    "createdAt": "datetime",
    "stickerCount": "number"
  }
]
```

### `GET /api/albums/:id`
Dettagli album specifico.

### `POST /api/albums`
Creazione nuovo album (solo admin).

**Request Body:**
```json
{
  "name": "string",
  "year": "number",
  "active": "boolean"
}
```

### `PUT /api/albums/:id`
Modifica album esistente (solo admin).

### `DELETE /api/albums/:id`
Eliminazione album (solo admin).

## 🃏 Gestione Figurine

### `GET /api/albums/:id/stickers`
Lista figurine di un album.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "albumId": "uuid",
    "number": "string",
    "name": "string",
    "team": "string|null",
    "createdAt": "datetime"
  }
]
```

### `POST /api/albums/:id/stickers`
Creazione singola figurina (solo admin).

**Request Body:**
```json
{
  "number": "string",
  "name": "string",
  "team": "string"
}
```

### `POST /api/albums/:id/stickers/bulk`
Import bulk figurine (solo admin).

**Request Body:**
```json
{
  "stickers": [
    {
      "number": "string",
      "name": "string",
      "team": "string"
    }
  ]
}
```

### `PUT /api/stickers/:id`
Modifica figurina (solo admin).

### `DELETE /api/stickers/:id`
Eliminazione figurina (solo admin).

## 🎯 Collezione Utente

### `GET /api/user/stickers/:albumId`
Stato figurine utente per album specifico.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "stickerId": "uuid",
    "status": "yes|no|double",
    "updatedAt": "datetime",
    "sticker": {
      "id": "uuid",
      "number": "string",
      "name": "string",
      "team": "string"
    }
  }
]
```

### `PUT /api/user/stickers/:stickerId`
Aggiornamento stato figurina utente.

**Request Body:**
```json
{
  "status": "yes|no|double"
}
```

## 🤝 Sistema Matching

### `GET /api/matches`
Lista match utente corrente.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "user1Id": "uuid",
    "user2Id": "uuid", 
    "albumId": "uuid",
    "status": "active|completed|cancelled",
    "createdAt": "datetime",
    "user1": { /* User object */ },
    "user2": { /* User object */ },
    "album": { /* Album object */ }
  }
]
```

### `GET /api/matches/potential`
Ricerca potenziali match per scambio figurine.

**Query Parameters:**
- `albumId`: UUID dell'album
- `radiusKm`: Raggio ricerca in km

**Response (200):**
```json
[
  {
    "user": { /* User object */ },
    "myNeeds": ["001", "002"],
    "myDoubles": ["003", "004"],
    "theirNeeds": ["003", "004"],
    "theirDoubles": ["001", "002"],
    "possibleExchanges": [
      {
        "myDouble": "003",
        "theirNeed": "003"
      }
    ]
  }
]
```

### `POST /api/matches`
Creazione nuovo match.

**Request Body:**
```json
{
  "user2Id": "uuid",
  "albumId": "uuid"
}
```

## 💬 Sistema Chat

### `GET /api/matches/:id/messages`
Messaggi di un match specifico.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "matchId": "uuid",
    "senderId": "uuid",
    "content": "string",
    "createdAt": "datetime",
    "sender": { /* User object */ }
  }
]
```

### `POST /api/matches/:id/messages`
Invio nuovo messaggio.

**Request Body:**
```json
{
  "content": "string"
}
```

## 🚨 Sistema Segnalazioni

### `GET /api/admin/reports`
Lista segnalazioni per admin con paginazione.

**Query Parameters:**
- `status`: nuovo|in_lavorazione|risolto
- `priority`: alta|media|bassa
- `type`: user|error|spam|js_error|network_error|api_error
- `page`: numero pagina (default: 1)
- `limit`: elementi per pagina (default: 20)

**Response (200):**
```json
{
  "reports": [
    {
      "id": "uuid",
      "reporterId": "uuid",
      "reportedUserId": "uuid|null",
      "type": "string",
      "description": "string",
      "status": "string",
      "priority": "string",
      "page": "string",
      "errorDetails": "string",
      "userAgent": "string",
      "url": "string",
      "createdAt": "datetime",
      "reporter": { /* User object */ },
      "reportedUser": { /* User object */ }
    }
  ],
  "total": "number",
  "hasNextPage": "boolean"
}
```

### `POST /api/reports`
Creazione segnalazione automatica.

**Request Body:**
```json
{
  "type": "js_error|network_error|api_error",
  "description": "string",
  "page": "string",
  "errorDetails": "string",
  "url": "string"
}
```

### `PUT /api/reports/:id`
Aggiornamento stato segnalazione (solo admin).

**Request Body:**
```json
{
  "status": "nuovo|in_lavorazione|risolto",
  "priority": "alta|media|bassa"
}
```

## 🏗️ Architettura Storage

L'API utilizza un sistema storage modulare basato su pattern Repository:

### Repository Disponibili

- **UserRepository**: Gestione utenti e autenticazione
- **AlbumRepository**: CRUD album
- **StickerRepository**: CRUD figurine e collezioni utente  
- **MatchRepository**: Algoritmo matching e ricerca
- **MessageRepository**: Sistema chat persistente
- **ReportRepository**: Segnalazioni con paginazione
- **AdminRepository**: Statistiche dashboard

### Connessione Database

```typescript
// server/storage/database/connection.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL,
});

export const db = drizzle(pool);
```

## 🔒 Middleware di Sicurezza

### `requireAuth`
Verifica presenza e validità del token JWT dal cookie `auth-token`.

### `requireAdmin`
Verifica che l'utente abbia role "admin" dal token JWT decodificato.

## 📝 Codici di Stato HTTP

- `200`: Successo
- `201`: Risorsa creata
- `400`: Richiesta non valida
- `401`: Non autenticato
- `403`: Non autorizzato
- `404`: Risorsa non trovata
- `500`: Errore server interno

## 🛠️ Utilizzo con React Query

L'API è ottimizzata per l'uso con React Query nel frontend:

```typescript
// Esempio query con JWT cookie automatico
const { data: albums } = useQuery({
  queryKey: ['/api/albums'],
  queryFn: async () => {
    const response = await fetch('/api/albums', {
      credentials: 'include' // Include JWT cookie automaticamente
    });
    return response.json();
  }
});

// Esempio mutation
const mutation = useMutation({
  mutationFn: async (albumData) => {
    const response = await fetch('/api/albums', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(albumData)
    });
    return response.json();
  }
});
```

---

## 🩺 Endpoint Diagnostici

### `GET /api/_health`
Health check completo del sistema.

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-08-18T20:37:37.000Z",
  "commit": "caf0631",
  "branch": "main",
  "DB_OK": true,
  "HAS_JWT_SECRET": true,
  "environment": "production"
}
```

### `GET /api/_seed`
Seeding utenti di test (solo development).

### `GET /api/_whoami`
Informazioni utente corrente dal token JWT.

---

**Ultimo aggiornamento**: 2025-08-18 - Migrazione completa a JWT, deployment Render, endpoint diagnostici
