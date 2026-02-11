# Structask - Frontend

A React-based task management application frontend built with Vite.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>
cd <project-folder>
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` and set your backend API URL:
```
VITE_API_URL=http://localhost:8000/api
```

4. Start the development server
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Backend Integration

This frontend expects a REST API backend with the following endpoints:

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get authenticated user

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: http://localhost:8000/api)

## Tech Stack

- React 18
- React Router DOM
- Axios
- Vite

## Project Structure

```
src/
├── components/       # React components
├── context/         # React context (Auth)
├── services/        # API service layer
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```
