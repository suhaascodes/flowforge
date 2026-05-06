# QUICK START GUIDE - FlowForge

## 🚀 Start the Application (3 Steps)

### Step 1: Open Terminal 1 - Frontend
```bash
cd "/Users/suhaasbandari/Desktop/Mitt Arv Assessment/frontend"
npm run dev
```

### Step 2: Open Terminal 2 - Backend  
```bash
cd "/Users/suhaasbandari/Desktop/Mitt Arv Assessment/backend"
npm run dev
```

### Step 3: Open Browser
Navigate to: **http://localhost:5173**

---

## 📋 What's Ready

### ✅ Frontend
- React 18 with Vite
- Tailwind CSS with custom theme
- React Router v6 (public/protected routes)
- Authentication Context
- API service layer with Axios
- Global styles and utilities
- Custom hooks

### ✅ Backend
- Express.js server
- MongoDB connection ready
- JWT authentication setup
- Error handling middleware
- Security headers (Helmet)
- CORS configured
- Response standardization

### ✅ Database
- User schema (with roles, timestamps)
- Task schema (with history, comments)
- Indexes ready
- Activity tracking setup

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `frontend/src/App.jsx` | Main app component with routing |
| `frontend/src/context/AuthContext.jsx` | Authentication state & logic |
| `frontend/src/api/index.js` | All API endpoints |
| `backend/app.js` | Express app configuration |
| `backend/server.js` | Server entry point |
| `backend/models/User.js` | User database schema |
| `backend/models/Task.js` | Task database schema |
| `backend/.env` | Backend configuration |
| `frontend/.env.local` | Frontend configuration |

---

## 🔑 Important Ports

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Proxy:** http://localhost:5173/api → http://localhost:5000

---

## 📚 File Structure

```
FlowForge/
├── frontend/
│   ├── src/
│   │   ├── api/          ← API calls
│   │   ├── components/   ← React components (coming)
│   │   ├── context/      ← Auth state
│   │   ├── layouts/      ← Layout wrappers
│   │   ├── pages/        ← Page components (coming)
│   │   ├── utils/        ← Helpers & validators
│   │   ├── constants/    ← App constants
│   │   └── styles/       ← Global CSS
│   ├── package.json      ← Dependencies
│   └── .env.local        ← Configuration
│
├── backend/
│   ├── models/           ← Database schemas
│   ├── controllers/      ← Route logic (coming)
│   ├── routes/           ← API routes (coming)
│   ├── middleware/       ← Auth, errors
│   ├── utils/            ← Helpers
│   ├── config/           ← Database connection
│   ├── app.js            ← Express setup
│   ├── server.js         ← Server start
│   ├── package.json      ← Dependencies
│   └── .env              ← Configuration
│
└── README.md             ← Documentation
```

---

## 🧪 Test Backend is Running

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## 🔐 Authentication Flow (Ready)

1. User registers → API call to `/api/auth/register` (Backend - Phase 2)
2. User logs in → API call to `/api/auth/login` (Backend - Phase 2)
3. Token stored in localStorage
4. Token sent in all API requests via Axios interceptor
5. Protected routes check authentication state
6. Invalid/expired tokens redirect to login

---

## 📦 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6 |
| **Styling** | Tailwind CSS |
| **Backend** | Express.js, Node.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT, bcryptjs |
| **HTTP** | Axios |
| **Icons** | React Icons |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Drag & Drop** | dnd-kit |

---

## ✨ Next Phase (Phase 2)

When ready for Phase 2, implement:
1. Auth controller (register, login, validate)
2. Auth routes
3. Task controller & routes
4. User controller & routes
5. API testing

---

## 🎯 Project Status

- [x] **Phase 1:** ✅ COMPLETE - Project initialization
- [ ] **Phase 2:** ⏳ Next - Backend APIs
- [ ] **Phase 3:** Authentication frontend
- [ ] **Phase 4:** Dashboard layouts
- [ ] **Phase 5:** Task management
- [ ] **Phase 6:** Kanban board
- [ ] **Phase 7:** Activity timeline
- [ ] **Phase 8-10:** Polish & deployment

---

## 💡 Pro Tips

- **Hot Reload:** Both frontend and backend support hot reload during development
- **API Prefix:** Frontend proxies `/api/*` to backend via Vite config
- **Tokens:** Axios automatically includes JWT token in all requests
- **Validation:** Helper functions ready in `frontend/src/utils/`
- **Styling:** Use Tailwind classes; custom colors in `tailwind.config.js`

---

**Last Updated:** Phase 1 Completion
**Status:** ✅ Ready to Code Phase 2

