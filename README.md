# FlowForge - Project Management Utility

A modern, production-grade MERN stack project management and task tracking application.

## Project Status

🔨 **Phase 1: Project Initialization** ✅ COMPLETED
- ✅ Project structure created
- ✅ Frontend setup with Vite + React
- ✅ Backend setup with Express + Node.js
- ✅ Tailwind CSS configured
- ✅ MongoDB connection configured
- ✅ Environment setup
- ⏳ **Next: Phase 2 - Backend Architecture & APIs**

## Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **HTTP**: Axios with interceptors
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Charts**: Recharts
- **Drag & Drop**: dnd-kit

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcryptjs
- **Security**: Helmet, CORS
- **Validation**: express-validator
- **Logging**: Morgan

## Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)

### Clone & Setup

```bash
# Navigate to project directory
cd "/Users/suhaasbandari/Desktop/Mitt Arv Assessment"

# Frontend setup
cd frontend
npm install
cp .env.example .env.local

# Backend setup (in new terminal)
cd backend
npm install
cp .env.example .env
```

## Configuration

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=FlowForge
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/flowforge
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

## Running the Application

### Terminal 1 - Frontend
```bash
cd frontend
npm run dev
# Open http://localhost:5173
```

### Terminal 2 - Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

## Project Structure

```
FlowForge/
├── frontend/
│   ├── src/
│   │   ├── api/              # API endpoints
│   │   ├── assets/           # Images, fonts, etc.
│   │   ├── components/       # Reusable UI components
│   │   ├── layouts/          # Layout wrappers
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── context/          # Context API & state
│   │   ├── utils/            # Utility functions
│   │   ├── constants/        # App constants
│   │   ├── styles/           # Global styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/
    ├── config/               # Configuration files
    ├── controllers/          # Route controllers
    ├── middleware/           # Express middleware
    ├── models/               # Mongoose schemas
    ├── routes/               # API routes
    ├── utils/                # Utility functions
    ├── validators/           # Request validators
    ├── services/             # Business logic
    ├── app.js                # Express app setup
    ├── server.js             # Server entry point
    └── package.json
```

## Features (In Development)

### ✅ Phase 1: Completed
- [x] Project initialization
- [x] Frontend & backend scaffolding
- [x] Database connection
- [x] Tailwind CSS setup

### ⏳ Phase 2: Backend APIs
- [ ] User authentication (Login, Register)
- [ ] Task CRUD operations
- [ ] User management
- [ ] API error handling

### ⏳ Phase 3: Authentication
- [ ] JWT authentication
- [ ] Protected routes
- [ ] Role-based access control
- [ ] Persistent login

### ⏳ Phase 4: Frontend Layouts
- [ ] Dashboard layout
- [ ] Sidebar navigation
- [ ] Navbar with user menu
- [ ] Responsive design

### ⏳ Phase 5: Task Management
- [ ] Task creation & editing
- [ ] Task filtering & search
- [ ] Task assignment
- [ ] Priority & status management

### ⏳ Phase 6: Kanban Board
- [ ] Drag-and-drop functionality
- [ ] Status column management
- [ ] Animated transitions

### ⏳ Phase 7: Activity Timeline
- [ ] Task history tracking
- [ ] Activity feed
- [ ] Change logs

### ⏳ Phase 8-10: Polish & Deployment
- [ ] UI/UX optimization
- [ ] Performance optimization
- [ ] Deployment configuration

## Next Steps

👉 **Phase 2 will include:**
- Backend models (already created)
- Authentication controller & routes
- Task controller & routes
- User management APIs
- API testing

## Contributing

This is a personal project. For any improvements, feel free to fork and create a pull request.

## Deployment

Coming in Phase 10:
- Frontend: Vercel/Netlify
- Backend: Render/Railway
- Database: MongoDB Atlas

## License

MIT
