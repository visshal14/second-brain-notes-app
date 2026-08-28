# Second Brain — Notes App

Save notes with tags and links, search them, embed YouTube / X links, ask questions about your own notes with AI, and share a note through a public read-only link.

- **Frontend** — React (Vite) + plain CSS
- **Backend** — Node + Express
- **Database** — Postgres (Neon)
- **AI** — Groq API

## Folders

```
backend/    express api
frontend/   react app
```

## Setup

You need Node 18+, a free [Neon](https://neon.tech) postgres database and a free [Groq](https://console.groq.com) api key.

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
PORT=3001

# neon connection string
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# any long random string, used to sign the jwt
JWT_SECRET=

# free key from https://console.groq.com
GROQ_API_KEY=

# used to build the public share link
FRONTEND_URL=http://localhost:5173
```

Create the tables, then start the api:

```bash
npm run db:init
npm run dev
```

`db:init` runs `db/schema.sql`, which creates `users` and `notes` if they are not
there yet. It does not touch a table that already exists, so run it on an empty
database.

The default model is `openai/gpt-oss-120b`. Groq retires models now and then, so
if `/api/ask` starts answering 502, pick a live one from
`https://api.groq.com/openai/v1/models` and set `GROQ_MODEL` in `.env`.

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:3001/api
```

```bash
npm run dev
```

The app runs on http://localhost:5173 and expects the api on http://localhost:3001.

## API

| Method | Route | Auth | What it does |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | — | create an account, returns a jwt |
| POST | `/api/auth/login` | — | log in, returns a jwt |
| GET | `/api/auth/me` | yes | the logged in user |
| GET | `/api/notes?search=&tag=` | yes | list notes, search title + content, filter by tag |
| POST | `/api/notes` | yes | create a note |
| GET | `/api/notes/:id` | yes | one note |
| PUT | `/api/notes/:id` | yes | update, only the fields you send |
| DELETE | `/api/notes/:id` | yes | delete |
| GET | `/api/tags` | yes | every tag you have used |
| PUT | `/api/notes/:id/share` | yes | share or unshare, returns the share url |
| GET | `/api/public/:shareId` | — | read a shared note |
| GET | `/api/embed?url=&maxwidth=` | — | oembed html for a youtube or x link |
| POST | `/api/ask` | yes | ask a question about your notes |

Private routes take the token as `Authorization: Bearer <token>`.

## Pages

| Path | What it is |
| --- | --- |
| `/` | your notes, with search and tag filter |
| `/notes/new` | new note |
| `/notes/:id` | edit a note, share it, preview its link |
| `/ask` | ask a question about your notes |
| `/login`, `/register` | account pages |
| `/share/:shareId` | public read only note, no login |

## Notes

- Passwords are stored as bcrypt hashes, and a login never says whether it was
  the email or the password that was wrong.
- A share link uses the note's own uuid, so unsharing and sharing again gives
  back the same link.
- `/api/embed` only calls youtube and x, the host is checked against a fixed
  list so it cannot be pointed somewhere else.
- The ai answers from your notes only. It is sent the 25 newest notes, 800
  characters each, 12000 characters in total.
