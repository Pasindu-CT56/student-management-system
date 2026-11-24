# Student Management System

A simple full-stack Student Management System built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- Dashboard with live student and course statistics
- Create, view, update and delete student records
- Search students by name, email or course
- MongoDB Atlas database integration
- Responsive dashboard layout

## Tech Stack

- Frontend: React, Vite, Axios, Lucide React, CSS
- Backend: Node.js, Express
- Database: MongoDB Atlas, Mongoose

## Project Structure

```text
student-management-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/
│       ├── App.jsx
│       └── index.css
├── .gitignore
└── README.md
```

## Setup

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd student-management-system
```

### 2. Configure MongoDB

Create a free MongoDB Atlas cluster, create a database user, and allow your IP address in Network Access.

In `backend`, create a `.env` file based on `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/studentDB
```

Replace the placeholders with your Atlas connection details. Do not commit `.env`.

### 3. Start the backend

```bash
cd backend
npm install
npm run dev
```

Backend runs at `http://localhost:5000`.

### 4. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## API Endpoints

Base URL: `/api/students`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all students; optional `?search=` |
| GET | `/stats` | Get dashboard statistics |
| GET | `/:id` | Get one student |
| POST | `/` | Create a student |
| PUT | `/:id` | Update a student |
| DELETE | `/:id` | Delete a student |

## Notes

- This is a learning/demo project. It does not include authentication or role-based access.
- Validate and protect the API before deploying it for real student data.
