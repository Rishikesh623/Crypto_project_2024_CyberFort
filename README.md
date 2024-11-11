
# FortiQuiz

FortiQuiz is a secure and proctored online quiz application built using the MERN stack (MongoDB, Express, React, and Node.js). Designed for educational institutions, corporate training programs, and professional certification exams, FortiQuiz ensures a secure and integrity-driven assessment experience. This project integrates real-time monitoring, proctoring features, and user-friendly quiz management, making it an all-in-one solution for online testing.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Security Features](#security-features)
- [Proctoring Features](#proctoring-features)
- [License](#license)

## Features

1. **User Authentication**: Secure sign-up and login with JWT-based authentication.
2. **Quiz Management**: Quiz creation, editing, and tracking functionalities for quiz creators.
3. **Real-Time Video Monitoring**: Enables live video feeds for proctoring during quizzes.
4. **Proctoring Dashboard**: Provides quiz creators with real-time participant monitoring, including rule violation tracking.
5. **Participant Rules Enforcement**: Includes tab-switch detection, session security, and encrypted question data to prevent cheating.
6. **Quiz History**: Allows users to view past quizzes, results, and performance summaries.
7. **Session Security**: Features session timeouts, IP logging, and anomaly detection for added security.

## Technologies Used

- **Frontend**: **React**, HTML, CSS
- **Backend**: **Node.js**, **Express.js**
- **Database**: **MongoDB**
- **Real-Time Communication**: **WebRTC** (for video streaming) and **Socket.IO** (for signaling)
- **Security**: **JWT** for authentication, **bcrypt** for password hashing, **AES** encryption for sensitive data

## Installation

To get started with FortiQuiz on your local environment, follow these steps:

### Prerequisites

- **Node.js** (version 14.x or later)
- **MongoDB** (running locally or a MongoDB cloud instance)

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/fortiquiz.git
   cd fortiquiz
   ```

2. **Install Dependencies**:
   - Install backend dependencies:
     ```bash
     cd server
     npm install

     cd ../socket
     npm install 
     ```
   - Install frontend dependencies:
     ```bash
     cd ../client
     npm install
     ```

3. **Environment Variables**:
   Create a `.env` file in the `backend` directory with the following variables:

   ```plaintext
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SOCKET_PORT=4000
   ```

4. **Run the Application**:
   - Start the backend server:
     ```bash
     cd server
     nodemon server.js

     cd ../socket
     nodmeon
     ```
   - Start the frontend server:
     ```bash
     cd ../client
     npm start
     ```

   The backend will run on `http://localhost:5000` for server && `http://localhost:4000` for socket and the frontend on `http://localhost:3000`.

## Usage

1. **Sign Up**: Register as a new user and log in to access quiz management features.
2. **Create a Quiz**: Navigate to the dashboard, click on "Create Quiz," and customize the quiz details, such as questions and time limits.
3. **Start Quiz & Monitor**: Initiate the quiz and monitor participants in real-time through the proctoring dashboard.
4. **Review Results**: Access quiz history to view results, rule violations, and participant performance summaries.

## Project Structure

```
FortiQuiz/
├── client/               # Frontend code (React application)
│   ├── src/
│   │   ├── components/   # React components (UI elements, quiz management, proctoring)
│   │   ├── context/      # Context API for state management
│   │   ├── services/     # API service functions
│   │   └── pages/       # Socket.IO client-side configuration and events
├── server/               # Backend code (Express server, authentication, and quiz API)
│   ├── models/           # MongoDB models (User, Quiz, Results)
│   ├── routes/           # API routes
│   ├── controllers/      # Controllers for request handling
│   ├── middlewares/            # Utility functions - authentication middleware
│   └── server.js         # Main server file to initialize the Express server and Socket.IO
├── socket/               # Socket.IO server-side configuration for real-time communication
│   └── index.js          # Main file for handling Socket.IO events and connections
├── .gitignore            # Git ignore file to exclude unnecessary files from version control
└── README.md             # Project README file

```

## Security Features

- **AES Encryption**: Quiz questions are encrypted before storage, ensuring data security at rest.
- **JWT Authentication**: Users are authenticated using JSON Web Tokens, providing secure access without repeated login prompts.
- **Password Hashing**: User passwords are hashed with bcrypt, protecting against password theft.
- **Session Security**: IP logging and session timeouts provide enhanced control over user sessions and detect unusual access patterns.
- **Tab-Switch Detection**: Any attempt by participants to switch tabs is logged, ensuring focus remains on the quiz page.

## Proctoring Features

- **Real-Time Video Feed**: Using WebRTC and Socket.IO, quiz creators can watch participants in real time to prevent cheating.
- **Participant Monitoring Dashboard**: Displays session details, violations, and remaining time for each participant.
- **Manual Removal Option**: Quiz creators can remove participants from the session if they detect cheating or policy violations.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

