import './App.css';
import Home from './pages/Home.jsx';
import Signin from './pages/Signin.jsx';
import Signup from './pages/Signup.jsx';
import Quiz from './pages/Quiz.jsx';
import QuizForm from './pages/QuizForm.jsx';
import User from './pages/User.jsx';
import { QuizProvider } from './contexts/QuizContext';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <QuizProvider>
      <Routes>
        <Route element=<Home /> path="/" />
        <Route element=<Signin /> path="/signin" />
        <Route element=<Signup /> path="/signup" />
        <Route element=<Quiz /> path="/quiz/:quizId" />
        <Route element=<QuizForm /> path="/create-quiz" />
        <Route element=<User/> path="/user/:userID" />
      </Routes>
    </QuizProvider>

  );
}

export default App;
