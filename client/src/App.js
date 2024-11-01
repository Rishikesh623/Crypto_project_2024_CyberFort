import './App.css';
import { Routes, Route } from 'react-router-dom';
import { QuizProvider } from './contexts/QuizContext';
import { useUserContext } from './contexts/UserContext.js';
import Home from './pages/Home.jsx';
import Signin from './pages/Signin.jsx';
import Signup from './pages/Signup.jsx';
import Quiz from './pages/Quiz.jsx';
import QuizForm from './pages/QuizForm.jsx';
import QuizView from './pages/QuizView.jsx';
import DashBoard from './pages/DashBoard.jsx';
import QuizMonitor from './pages/QuizMonitor.jsx';
import NotFound from './pages/NotFound.jsx';
// import RT from './pages/RT.jsx';

function App() {
  const {user} = useUserContext();
  return (

    <QuizProvider>
      <Routes>
        <Route element={user?.name ? <DashBoard/> : <Home />} path="/" />
        <Route element=<Signin /> path="/signin" />
        {/* <Route element=<RT /> path="/rt" /> */}
        <Route element=<Signup /> path="/signup" />
        <Route element=<Quiz /> path="/quiz/:quizId" />
        <Route element=<QuizForm /> path="/create-quiz" />
        <Route element=<DashBoard selectedOption="profile"/> path="/dashboard" />
        <Route element=<DashBoard selectedOption="profile" /> path="/dashboard/profile" />
        <Route element=<DashBoard selectedOption="quiz-history" /> path="/dashboard/quiz-history" />
        <Route element=<QuizView/> path="/quiz/view-quiz/:id" />
        <Route element=<DashBoard selectedOption="quiz-result" /> path="/dashboard/quiz-history/quiz-result" />
        <Route element=<QuizMonitor/> path="/dashboard/quiz-monitor/:id"/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </QuizProvider>

  );
}

export default App;
