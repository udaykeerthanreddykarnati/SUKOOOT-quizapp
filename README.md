# SUKOOOT – Real-Time Multiplayer Quiz (MERN)

**Repository:**
https://github.com/udaykeerthanreddykarnati/quiz-app-mern

A real-time multiplayer quiz platform where a **host creates a quiz room** and **players join using a room code**.
The host controls question flow, players answer in real time, scores update live, and a **final leaderboard** is generated when the quiz ends.

---

# Features

## Host

* Create quiz rooms
* Add questions with multiple options
* Start the quiz
* Move to the next question
* End quiz at any time
* View live player scores
* View final leaderboard

## Player

* Join using room code
* Answer questions in real time
* Automatic score updates
* View final leaderboard when quiz ends

---

# Tech Stack

### Frontend

* React
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* CORS

### Database

* MongoDB (local instance)

---

# Project Structure

```
quiz-app-mern
│
├── server.js
│
├── frontend
│   ├── App.jsx
│   ├── Host.jsx
│   ├── Player.jsx
│   ├── main.jsx
│   ├── styles.css
│   └── owl_logo.png
│
└── README.md
```

---

# Installation

## 1. Clone the repository

```
git clone https://github.com/udaykeerthanreddykarnati/quiz-app-mern.git
cd quiz-app-mern
```

---

## 2. Install Backend Dependencies

```
npm install express cors mongodb
```

---

## 3. Install Frontend Dependencies

```
npm install
npm install axios
```

---

# Running the Application

## Start MongoDB

Ensure MongoDB is running locally:

```
mongodb://127.0.0.1:27017
```

---

## Start Backend

```
node server.js
```

Server runs on:

```
http://localhost:5000
```

---

## Start Frontend

```
npm run dev
```

React app runs on:

```
http://localhost:5173
```

---

# API Endpoints

## Create Quiz

```
POST /api/createQuiz
```

Request body:

```
{
  "title": "Quiz Name",
  "questions": []
}
```

Response:

```
{
  "room": "123456"
}
```

---

## Join Room

```
POST /api/join
```

Request body:

```
{
  "name": "Player1",
  "room": "123456"
}
```

---

## Start Quiz

```
POST /api/start
```

---

## Next Question

```
POST /api/next
```

---

## Submit Answer

```
POST /api/answer
```

Request body:

```
{
  "room": "123456",
  "name": "Player1",
  "answer": 1
}
```

Correct answers award **10 points**.

---

## Get Room Status

```
GET /api/status/:room
```

Returns:

* players
* scores
* current question
* quiz state

---

## End Quiz

```
POST /api/end
```

Generates and stores the **final leaderboard**.

---

# Database Schema

Collection: `rooms`

```
{
  room: "123456",
  title: "Quiz Title",
  questions: [
    {
      text: "Question",
      options: ["A","B","C","D"],
      correct: 1
    }
  ],
  currentIndex: 0,
  started: true,
  ended: false,
  players: [
    { name: "Alice", score: 20 },
    { name: "Bob", score: 10 }
  ],
  leaderboard: [
    { rank: 1, name: "Alice", score: 20 }
  ]
}
```

---

# Quiz Flow

1. Host creates a quiz and receives a **room code**
2. Players join using the room code
3. Host starts the quiz
4. Questions appear on player screens
5. Players submit answers
6. Scores update in real time
7. Host moves to the next question
8. Host ends the quiz
9. Final leaderboard is displayed to all players

---

# Future Improvements

* WebSocket support for real-time updates
* Timer for each question
* Prevent multiple answers per question
* Authentication for hosts
* Player avatars
* Quiz analytics
* Deployment to cloud (Render / Vercel / MongoDB Atlas)

---

# Author

**Uday Keerthan Reddy**
Computer Science Student

Project Repository:
https://github.com/udaykeerthanreddykarnati/quiz-app-mern
