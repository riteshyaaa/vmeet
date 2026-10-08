# VMeet - Real-Time Video Conferencing Application

VMeet is a full-stack real-time video conferencing application built with WebRTC, Socket.IO, Node.js/Express, PostgreSQL, and React (Vite).

## Features

- **Real-Time Video & Audio:** Peer-to-peer communication using WebRTC (Mesh topology) with STUN servers.
- **Screen Sharing:** Integrated screen capture and stream sharing.
- **In-Call Real-Time Chat:** Exchange instant messages during meetings via WebSockets.
- **User Authentication:** Secure registration and login with bcrypt password hashing and token-based sessions.
- **Relational Database Storage:** PostgreSQL database storing user profiles, credentials, and meeting history.
- **Responsive UI:** Modern, responsive interface built with Material UI (MUI).

## Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **UI Components & Icons:** Material-UI (`@mui/material`, `@mui/icons-material`, Emotion)
- **Routing:** React Router v7
- **Networking:** Axios, Socket.IO Client
- **Signaling & Media:** WebRTC (RTCPeerConnection, getUserMedia)

### Backend
- **Runtime & Server:** Node.js, Express 5
- **Real-Time Engine:** Socket.IO
- **Database:** PostgreSQL (`pg`) with automatic schema initialization
- **Security:** Bcrypt password hashing, Crypto tokens, CORS

## Project Structure

```
vmeet/
├── backend/
│   ├── src/
│   │   ├── config/          # PostgreSQL pool and table setup
│   │   ├── controllers/     # Authentication & Socket handlers
│   │   ├── models/          # Data models
│   │   ├── routes/          # API route definitions
│   │   └── app.js           # Server entry point
│   ├── .env.example
│   ├── package.json
│   └── .gitignore
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── assets/          # SVG & media assets
│   │   ├── context/         # AuthContext provider
│   │   ├── pages/           # Landing, Auth, VideoMeet pages
│   │   ├── styles/          # Modular CSS stylesheets
│   │   ├── App.jsx          # Route configuration
│   │   ├── environment.js   # API server endpoint config
│   │   └── main.jsx         # Vite entry point
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to start using VMeet.
