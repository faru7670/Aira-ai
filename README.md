# AIRA-AI (ChatGPT-style AI Web App)

A production-ready full-stack AI chat app with:
- React + Vite + Tailwind frontend
- Node.js + Express backend
- Firebase Google Authentication
- Guest mode (no history)
- Logged-in history stored in backend memory
- OpenRouter LLM integration (`mistralai/mistral-7b-instruct`)

## 1) Architecture Overview

- **Client (`/client`)**
  - Handles routing, authentication, chat UI, message input, loaders, and error states.
  - Uses Firebase Auth for Google login + persisted auth state.
  - Calls only backend APIs (`/api/chat`, `/api/history/:uid`).
- **Server (`/server`)**
  - Securely stores OpenRouter API key in environment variables.
  - Proxies chat requests to OpenRouter.
  - Maintains in-memory chat history for authenticated users by Firebase UID.
  - Guest users pass no UID, so no history is stored.

## 2) Folder Structure

```text
aira-ai/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Chat.jsx
│   │   │   └── GuestChat.jsx
│   │   ├── components/
│   │   │   ├── ChatInput.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Loader.jsx
│   │   ├── firebase.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
├── server/
│   ├── index.js
│   ├── routes/
│   │   └── chat.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## 3) Prerequisites (Windows + VS Code)

Install:
- **Node.js 20+** (includes npm)
- **Git**
- **VS Code**

Open terminal in VS Code at the project root (`aira-ai`).

## 4) Backend Setup

```bash
cd server
npm install
copy .env.example .env
```

Open `server/.env` and set:

```env
PORT=5000
OPENROUTER_API_KEY=your_real_openrouter_key
OPENROUTER_MODEL=mistralai/mistral-7b-instruct
OPENROUTER_SITE_URL=http://localhost:5173
OPENROUTER_SITE_NAME=AIRA-AI
CLIENT_ORIGIN=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

Health check:

```bash
# in a second terminal
curl http://localhost:5000/health
```

## 5) Firebase Google Login Setup

1. Go to [Firebase Console](https://console.firebase.google.com).
2. Create project (or use existing).
3. Add a **Web App** and copy config keys.
4. In Firebase → **Authentication** → **Sign-in method**:
   - Enable **Google** provider.
5. Add localhost domain if needed in authorized domains.

## 6) Frontend Setup

Create `client/.env` with your Firebase values:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_API_URL=http://localhost:5000
```

Then install and run client:

```bash
cd ../client
npm install
npm run dev
```

Open: `http://localhost:5173`

## 7) App Features Delivered

- Google login with Firebase
- Email verification handling (`emailVerified` or trusted Google provider)
- Auth persistence via Firebase built-in session handling
- Logout
- Guest mode route (`/guest`)
- Guest mode chats are not stored
- Logged-in chat history in memory by UID
- ChatGPT-style layout
- Enter sends, Shift+Enter creates newline
- Loading animation while model responds
- Error rendering for failed AI calls
- Clear chat button
- Responsive UI

## 8) API Contract

### `POST /api/chat`
Request:

```json
{
  "uid": "firebase-user-id-optional",
  "messages": [
    { "role": "user", "content": "Hello" }
  ]
}
```

Response:

```json
{
  "reply": "AI response text"
}
```

### `GET /api/history/:uid`
Returns logged user message history stored in memory.

### `DELETE /api/history/:uid`
Clears logged user history.

## 9) Security Notes

- OpenRouter API key is used **only on backend**.
- Frontend never calls OpenRouter directly.
- `.env` files are ignored in `.gitignore`.
- Keep `.env.example` committed to show required keys safely.

## 10) GitHub Workflow (Beginner Friendly)

### Initialize and first push

```bash
git init
git add .
git commit -m "Initial AIRA-AI full-stack app"
git branch -M main
git remote add origin https://github.com/<your-username>/aira-ai.git
git push -u origin main
```

### Invite collaborator

1. GitHub repo → **Settings** → **Collaborators**.
2. Click **Add people**.
3. Enter GitHub username/email and send invite.

### Pull latest changes

```bash
git checkout main
git pull origin main
```

### Create feature branch and push

```bash
git checkout -b feature/new-ui
git add .
git commit -m "Improve chat UI"
git push -u origin feature/new-ui
```

### Resolve merge conflicts

1. Run `git pull origin main` in your feature branch.
2. Open conflicted files in VS Code.
3. Choose correct code and remove conflict markers:
   - `<<<<<<<`
   - `=======`
   - `>>>>>>>`
4. Then:

```bash
git add .
git commit -m "Resolve merge conflicts"
git push
```

## 11) Production Considerations (Next Step)

- Replace in-memory history with database (PostgreSQL/MongoDB).
- Add server-side Firebase token verification for stronger auth trust.
- Add rate limiting and abuse protection.
- Add logging/monitoring and error tracing.
- Deploy client (Vercel/Netlify) + server (Render/Railway/Fly.io).
