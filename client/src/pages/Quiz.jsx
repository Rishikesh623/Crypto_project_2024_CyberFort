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
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [fullscreenWarningGiven, setFullscreenWarningGiven] = useState(false);
    const [showCustomAlert, setShowCustomAlert] = useState({type:"noalert",title:"",message:""}); // Custom alert state
    const [fullscreenTimeout, setFullscreenTimeout] = useState(null);
    const maxAllowedSwitches = 3;
    const maxTimeOutOfFullscreen = 10 * 1000; // 10 seconds in milliseconds
    const questions = quiz.questions;

    useEffect(() => {
        if (quiz.participants.includes(user._id)) {
            navigate("/dashboard");
            setTimeout(() => {
                setShowCustomAlert({type:"info",title:"Info",message:"You have already participated in this quiz."})
                // alert('You have already participated in this quiz.');
            }, 1000);
            return;
        }
    }, [quiz])

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
            // alert("Some error occurred while Quiz submission!!!");
            setShowCustomAlert({type:"error",title:"Error",message:"Some error occurred while Quiz submission!!!"})
            return;
        }
        // alert("Quiz Submitted Successfully!!!.Now you will be redirected to home page.");
        setShowCustomAlert({type:"success",title:"Success",message:"Quiz Submitted Successfully.Now you will be redirected to home page."})
        navigate('/dashboard');
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                setTabSwitchCount(prevCount => prevCount + 1);
                // logTabSwitch(); // Log tab switch
            }
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                // User exited fullscreen mode
                setIsFullscreen(false);
                if (!fullscreenWarningGiven) {
                    setFullscreenWarningGiven(true);
                    setShowCustomAlert({ type: "warning", title: "Warning", message: "Enter fullscreen mode within 10 seconds." });
                    startFullscreenTimeout();  // Start the timeout when they exit fullscreen
                }
            } else {
                // User returned to fullscreen mode
                setIsFullscreen(true);
                clearFullscreenTimeout();  // Clear the timeout when they return to fullscreen
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [document.fullscreenElement]);

    // const logTabSwitch = async () => {
    //     try {
    //         const response = await fetch('/api/log-tab-switch', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ userId, quizId, timestamp: new Date() }),
    //         });

    //         if (response.ok) {
    //             console.log('Tab switch logged successfully');
    //         } else {
    //             console.error('Failed to log tab switch');
    //         }
    //     } catch (error) {
    //         console.error('Error logging tab switch:', error);
    //     }
    // };

    const startFullscreenTimeout = () => {
        const timeout = setTimeout(() => {
            if (!document.fullscreenElement) {
                endQuiz();  // End the quiz if still not in fullscreen after 10 seconds
            }
        }, maxTimeOutOfFullscreen);
        setFullscreenTimeout(timeout);  // Save the timeout reference
    };

    const clearFullscreenTimeout = () => {
        if (fullscreenTimeout) {
            clearTimeout(fullscreenTimeout);  // Clear the ongoing timeout
        }
    };

    const endQuiz = () => {
        // alert('Quiz ending.Guidelines violated!!!');
        setShowCustomAlert({type:"error",title:"Error",message:"Quiz ending.Guidelines violated!!!"})
        navigate(-1);
    };

    useEffect(() => {
        if(showCustomAlert.type !== "noalert") {
            console.log("Alert triggered:", showCustomAlert); // For debugging
        }
    }, [showCustomAlert]);

    useEffect(() => {
        if (tabSwitchCount >= maxAllowedSwitches) {
            // alert('You have switched tabs too many times. The quiz will now end.');
            setShowCustomAlert({type:"error",title:"Error",message:"You have switched tabs too many times. The quiz will now end."})
            endQuiz();
        }
    }, [tabSwitchCount]);

    const enterFullscreen = () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // For Safari
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { // For Firefox
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.msRequestFullscreen) { // For IE/Edge
            document.documentElement.msRequestFullscreen();
        }
        setIsModalOpen(false);
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
           
            {showCustomAlert.type!=="noalert" && (
                <MyAlert alert={showCustomAlert}/>
            )}

            {!isModalOpen && (
                <>
                    <QuizHeader name={user.name} title={quiz.title} quizAccessCode={quiz._id} />
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
                        Fullscreen Required
                    </Typography>
                    <Typography id="fullscreen-modal-description" sx={{ mt: 2 }}>
                        To continue with the quiz, please enter fullscreen mode.
                    </Typography>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={enterFullscreen}>
                        Enter Fullscreen
                    </Button>
                </Box>
            </Modal>
        </Box>

    );
}

export default Quiz;
