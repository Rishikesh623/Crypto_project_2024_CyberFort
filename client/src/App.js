import './App.css';
import Home from './pages/Home.jsx';
import Signin from './pages/Signin.jsx';
import Signup from './pages/Signup.jsx';
import Quiz from './pages/Quiz.jsx';
import QuizForm from './pages/QuizForm.jsx';
import QuizView from './pages/QuizView.jsx';
import QuizResult from './pages/QuizResult.jsx';
import { QuizProvider } from './contexts/QuizContext';
import { Routes, Route } from 'react-router-dom';
import DashBoard from './pages/DashBoard.jsx';
import QuizMonitor from './pages/QuizMonitor.jsx';

function App() {
  return (
    <QuizProvider>
      <Routes>
        <Route element=<Home /> path="/" />
        <Route element=<Signin /> path="/signin" />
        <Route element=<Signup /> path="/signup" />
        <Route element=<Quiz /> path="/quiz/:quizId" />
        <Route element=<QuizForm /> path="/create-quiz" />
        <Route element=<DashBoard/> path="/dashboard" />
        <Route element=<QuizView/> path="/dashboard/view-quiz" />
        <Route element=<QuizResult/> path="/dashboard/quiz-result" />
        <Route element=<QuizMonitor/> path="/dashboard/quiz-montior"/>
      </Routes>
    </QuizProvider>

  );
}

export default App;
