import { Alert, AlertTitle, Modal, Box, Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import QuizHeader from '../components/QuizHeader';
import Pagination from '../components/Pagination';
import QuestionBox from '../components/QuestionBox';
import MyAlert from '../components/MyAlert';

function Quiz() {
    const { user } = useUserContext();
    const { quiz, submitQuiz } = useQuiz();
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [showCustomAlert, setShowCustomAlert] = useState(null); // Custom alert state
    const [remainingTime, setRemainingTime] = useState(null);
    const maxAllowedSwitches = 3;
    const questions = quiz.questions;

    useEffect(() => {
        // function to calculate remaining time and update the state
        const calculateRemainingTime = () => {
            const currentTime = new Date().getTime();
            const endTime = new Date(quiz.end_time).getTime();
            const timeLeft = endTime - currentTime;
            
            if (timeLeft <= 0) {
                //if time has expired, automatically submit the quiz
                handleSubmit();
            } else {
                setRemainingTime(timeLeft);
            }
        };

        //start interval to update remaining time every second
        const timerInterval = setInterval(calculateRemainingTime, 1000);

        //cleanup interval on component unmount
        return () => clearInterval(timerInterval);
    }, [quiz]);

    const handleOptionChange = (event) => {
        const newSelectedOptions = { ...selectedOptions, [currentQuestion]: event.target.value };
        setSelectedOptions(newSelectedOptions);
    };

    const handleSubmit = async () => {
        const info = {
            quizId: quiz._id,
            selectedOptions: selectedOptions,
        };
        const res = await submitQuiz(info);
        if (res?.error) {
            setShowCustomAlert({ type: "error", title: "Error", message: "Some error occurred while Quiz submission!!!" });
            return;
        }
        setShowCustomAlert({ type: "success", title: "Success", message: "Quiz Submitted Successfully. Now you will be redirected to home page." });
        setTimeout(() => {
            navigate('/dashboard');
        }, 1000);
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                setTabSwitchCount(prevCount => prevCount + 1);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
    
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
    
    const endQuiz = () => {
        setShowCustomAlert({ type: "error", title: "Error", message: "Quiz ending. Guidelines violated!!!" });
        setTimeout(() => {
            navigate(-1);
        }, 2000);
    };

    useEffect(() => {
        if (tabSwitchCount >= maxAllowedSwitches) {
            setShowCustomAlert({ type: "error", title: "Error", message: "You have switched tabs too many times. The quiz will now end." });
            setTimeout(() => {
                endQuiz();
            }, 2000);
        }else if(tabSwitchCount>0){
            setShowCustomAlert({ type: "warning", title: "Warning", message: "Tab switch not allowed. Quiz will end if repeated." });
        }
    }, [tabSwitchCount]);

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>

            {showCustomAlert!==null && (
                <MyAlert alert={showCustomAlert} setShowCustomAlert={setShowCustomAlert}/>
            )}

            {!isModalOpen && (
                <>
                    <QuizHeader name={user.name} title={quiz.title} quizAccessCode={quiz._id} remainingTime={remainingTime}  />
                    <Pagination totalQuestions={quiz.questions.length} currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion} handleSubmit={handleSubmit} />
                    <QuestionBox question={quiz.questions[currentQuestion - 1]} selectedOption={selectedOptions[currentQuestion]} handleOptionChange={handleOptionChange} />
                </>
            )}

            <Modal
                open={isModalOpen}
                onClose={() => { }}
                aria-labelledby="fullscreen-modal-title"
                aria-describedby="fullscreen-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        textAlign: 'center'
                    }}
                >
                    <Typography id="fullscreen-modal-title" variant="h6" component="h2">
                        Welcome to the Quiz
                    </Typography>
                    <Typography id="fullscreen-modal-description" sx={{ mt: 2 }}>
                        Click the button below to start the quiz.
                    </Typography>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => setIsModalOpen(false)}>
                        Start Quiz
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}

export default Quiz;
