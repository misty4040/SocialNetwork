# Social Network Influence Analyzer

A full-stack MERN application for analyzing social network relationships using graph algorithms.

## Features
- **Network Visualization**: Interactive graph representing users and their connections.
- **Influencer Detection**: Identifies the most connected user in the network.
- **Shortest Path**: Uses BFS to find the minimum connection path between any two users.
- **Friend Recommendations**: Suggests potential connections based on mutual friends.
- **Community Detection**: Groups users into connected components using BFS/DFS.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, vis-network, Lucide-react, Framer Motion.
- **Backend**: Node.js, Express, MongoDB, Mongoose.

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally on `mongodb://localhost:27017/socialnet` or provide a `MONGODB_URI` in `.env`)

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file (optional)
# echo "MONGODB_URI=mongodb://localhost:27017/socialnet" > .env
npm run dev # or node server.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Usage
- Add users via the "Add New User" form.
- Connect users by selecting them from the dropdowns.
- Click "Trace Path" to see the shortest path highlighted on the graph.
- Scroll down to see mutual friend recommendations and community groups.
