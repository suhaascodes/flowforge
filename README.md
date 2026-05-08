# FlowForge — Project Management Utility

A modern, production-oriented MERN stack project and task management application.

## Project Status

This repository contains a production-oriented codebase scaffold for a SaaS-style task management product. The core architecture, APIs and frontend UX components have been implemented across the development phases below.

## Development Phases

### ✅ Phase 1: Project Initialization & Architecture

* Set up MERN stack project structure
* Configured React + Vite frontend
* Configured Node.js + Express backend
* Integrated MongoDB with Mongoose
* Configured Tailwind CSS
* Created scalable frontend/backend folder architecture
* Added environment configuration and reusable utilities
* Implemented professional project structure for scalability

---

### ✅ Phase 2: Backend API & Core Infrastructure

* Built RESTful API architecture
* Implemented authentication APIs
* Created task management APIs
* Added user management APIs
* Integrated JWT authentication middleware
* Added centralized error handling
* Implemented validation middleware
* Added role-based access control
* Created reusable service and controller layers
* Optimized MongoDB schemas and indexing

---

### ✅ Phase 3: Authentication System & Protected Routing

* Built login and registration system
* Implemented JWT-based authentication flow
* Added persistent authentication handling
* Created protected routes
* Built reusable auth components
* Integrated frontend with backend authentication APIs
* Added responsive SaaS-style authentication UI
* Implemented authentication context and route guards

---

### ✅ Phase 4: Dashboard Shell & Application Layout

* Built responsive dashboard shell
* Created collapsible sidebar navigation
* Added top navigation bar with search and profile controls
* Designed reusable dashboard UI components
* Added responsive mobile navigation
* Built dashboard overview page
* Added animated statistics cards and activity sections
* Implemented skeleton loaders and empty states
* Created scalable routing structure for future modules

---

### ✅ Phase 5: Kanban Task Management System

* Built drag-and-drop Kanban board using dnd-kit
* Created reusable task cards and column components
* Added task creation and task detail modals
* Implemented optimistic UI updates with rollback handling
* Added task workflow stages:

  * Backlog
  * Todo
  * In Progress
  * Review
  * Testing
  * Done
* Implemented modular board state management
* Added responsive Kanban layouts and smooth animations
* Created scalable service layer for task operations

---

### ✅ Phase 6: Advanced Features & Product Expansion

* Added analytics dashboard
* Implemented settings module
* Added advanced task management workflows
* Integrated admin bootstrap service
* Added task assignment and status tracking
* Improved reusable component architecture
* Enhanced API integration and data handling
* Expanded scalable frontend routing system

---

### ✅ Phase 7: UI/UX Refinement & Product Polish

* Improved responsive behavior across devices
* Enhanced animations and transitions using Framer Motion
* Optimized visual hierarchy and spacing
* Added polished hover interactions and loading states
* Improved accessibility and usability
* Refined modal interactions and dashboard aesthetics
* Enhanced overall SaaS-style product appearance
* Optimized frontend performance and user experience

---

### ✅ Phase 8: Version Control & Repository Management

* Integrated Git-based version control workflow
* Structured professional commit history
* Published project to GitHub
* Organized scalable repository structure
* Maintained clean development workflow and modular commits

---

## Current Features

### Authentication & Security

* JWT Authentication
* Protected Routes
* Persistent Login Sessions
* Role-Based Access Control
* Secure API Middleware

### Dashboard & Analytics

* Responsive Dashboard
* Analytics Overview
* Activity Monitoring
* Statistics Cards
* Team Overview

### Task Management

* Drag-and-Drop Kanban Board
* Task Creation & Editing
* Task Status Tracking
* Task Assignment
* Optimistic UI Updates
* Workflow-Based Task Organization

### UI/UX

* Modern SaaS-Style Design
* Responsive Layout
* Dark Theme Interface
* Smooth Animations
* Skeleton Loading States
* Reusable Component System

### Architecture

* Modular MERN Architecture
* REST API Design
* Reusable Service Layer
* Centralized Error Handling
* Scalable Folder Structure
* Production-Oriented Code Organization

---

## Installation

### Prerequisites

* Node.js 18+ and npm
* MongoDB (local or Atlas)

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

See the repository root and the `frontend/` and `backend/` folders for a full layout. The project uses a modular, service-oriented structure to keep controllers, services, validators and middleware separated for maintainability.

## Next Steps

* Continue expanding backend APIs and automated tests
* Add persistence and real-time delivery for notifications
* Improve seed/admin flows for production readiness
* Prepare CI/CD and deployment pipelines

## License

MIT
