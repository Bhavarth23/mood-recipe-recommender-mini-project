# Mood-Based Recipe Recommendation System

A simple web application that recommends recipes based on your current mood. Built with Express.js backend, SQLite database, and React frontend with Tailwind CSS.

## Features

- Select from 5 different moods (Happy, Sad, Stressed, Energetic, Relaxed)
- Get personalized recipe recommendations based on your mood
- Request new recipes if you don't like the current one
- Simple and intuitive user interface

## Tech Stack

- **Backend**: Express.js
- **Database**: SQLite
- **Frontend**: React, JavaScript, HTML, CSS
- **Styling**: Tailwind CSS

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Initialize the database with sample recipes:
```bash
npm run init-db
```

4. Start the backend server:
```bash
npm start
```

The backend server will run on `http://localhost:3001`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will automatically open in your browser at `http://localhost:3000`

## Usage

1. Select your current mood from the available options
2. View the recommended recipe with ingredients and instructions
3. Click "Get Another Recipe" if you want a different recipe for the same mood
4. Click "Back to Moods" to select a different mood

## Project Structure

```
.
├── backend/
│   ├── server.js          # Express server
│   ├── init-db.js         # Database initialization script
│   ├── recipes.db         # SQLite database (created after init)
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Tailwind CSS imports
│   ├── package.json       # Frontend dependencies
│   ├── tailwind.config.js # Tailwind configuration
│   └── postcss.config.js  # PostCSS configuration
└── README.md              # This file
```

## API Endpoints

- `GET /api/recipes/:mood` - Get a random recipe for a specific mood
- `GET /api/recipes/:mood/all` - Get all recipes for a specific mood
- `GET /api/health` - Health check endpoint

## Notes

- Make sure the backend server is running before using the frontend
- The database is initialized with sample recipes for each mood
- Each mood has multiple recipes, so you can request new ones
