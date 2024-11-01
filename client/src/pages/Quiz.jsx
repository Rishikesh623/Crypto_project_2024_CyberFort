import { Alert, AlertTitle, Modal, Box, Button, Typography } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import QuizHeader from '../components/QuizHeader';
import Pagination from '../components/Pagination';
import QuestionBox from '../components/QuestionBox';
import MyAlert from '../components/MyAlert';
import { io } from "socket.io-client";

function Quiz() {
    const { user } = useUserContext();
    const { quiz, submitQuiz } = useQuiz();
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [showCustomAlert, setShowCustomAlert] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);
    const maxAllowedSwitches = 3;

    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraStream, setCameraStream] = useState(null); // MediaStream reference

    const [socket, setSocket] = useState(null);

    const videoRef = useRef(null);
    const peerConnection = useRef(null);

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io("http://localhost:4000");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket == null) return;

        const participantInfo = {
            pid: user._id,
            pName: user.name,
            pEmail: user.email,
            quizId: quiz._id
        };
        socket.emit("joinQuizAsParticipant", participantInfo);

        // Initialize WebRTC connection and capture video
        const startVideoStream = async () => {
            try {
                const quizId = quiz._id;
                const pid = user._id;
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                setIsCameraActive(true); // Camera is active

                peerConnection.current = new RTCPeerConnection();

                // Add stream tracks to the WebRTC connection
                stream.getTracks().forEach((track) => {
                    peerConnection.current.addTrack(track, stream);
                });

                // Create and send offer
                const offer = await peerConnection.current.createOffer();
                await peerConnection.current.setLocalDescription(offer);
                socket.emit('offer', { offer, quizId, pid });

                // Handle incoming answer from quiz creator
                socket.on('receive-answer', async (data) => {
                    const remoteDesc = new RTCSessionDescription(data.answer);
                    await peerConnection.current.setRemoteDescription(remoteDesc);
                });

                // Forward ICE candidates to the server
                peerConnection.current.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('ice-candidate', { target: 'quiz-creator', candidate: event.candidate, quizId: quizId, pid: pid });
                    }
                };
            } catch (error) {
                setShowCustomAlert({ type: "warning", title: "Error accessing webcam", message: "Camera disabled! Please enable it to continue." });
                console.error("Error accessing webcam:", error);
            }
        };

        startVideoStream();

        socket.on("getAlert", (res) => {
            alert(res);
        });

        return () => {
            socket.off("getAlert");
            // Cleanup
            if (peerConnection.current) {
                peerConnection.current.close();
            }
        };
    }, [socket]);

    // Handle remaining time for the quiz
    useEffect(() => {
        const calculateRemainingTime = () => {
            const currentTime = new Date().getTime();
            const endTime = new Date(quiz.end_time).getTime();
            const timeLeft = endTime - currentTime;

            if (timeLeft <= 0) handleSubmit();
            else setRemainingTime(timeLeft);
        };

        const timerInterval = setInterval(calculateRemainingTime, 1000);
        return () => clearInterval(timerInterval);
    }, [quiz]);

    const handleOptionChange = (event) => {
        const newSelectedOptions = { ...selectedOptions, [currentQuestion]: event.target.value };
        setSelectedOptions(newSelectedOptions);
    };

    const handleSubmit = async () => {
        const info = { quizId: quiz._id, selectedOptions };
        const res = await submitQuiz(info);

        if (res?.error) {
            setShowCustomAlert({ type: "error", title: "Error", message: "Quiz submission failed!" });
            return;
        }

        socket.emit("submitQuiz", { quizId: quiz._id, pid: user._id });
        setShowCustomAlert({ type: "success", title: "Success", message: "Quiz submitted! Redirecting..." });
        setTimeout(() => navigate('/dashboard'), 1000);
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') setTabSwitchCount(prevCount => prevCount + 1);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    const endQuiz = () => {
        setShowCustomAlert({ type: "error", title: "Error", message: "Guidelines violated. Quiz ending!" });
        socket.emit("blockParticipant", { quizId: quiz._id, pid: user._id });
        setTimeout(() => navigate(-1), 2000);
    };

    useEffect(() => {
        if (tabSwitchCount >= maxAllowedSwitches) {
            setShowCustomAlert({ type: "error", title: "Error", message: "Quiz ending due to repeated tab switches!" });
            setTimeout(endQuiz, 2000);
        } else if (tabSwitchCount > 0) {
            setShowCustomAlert({ type: "warning", title: "Warning", message: "Tab switch detected! Repeat violations will end the quiz." });
        }
    }, [tabSwitchCount]);


    const checkCamera = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (error) {
            setShowCustomAlert({ type: "warning", title: "Quiz terminated.!!! Error accessing webcam", message: "Camera disabled! Please reload ad enable it to continue." });
            setTimeout(() => navigate(-1), 2000);
            console.error('Camera is blocked or not available');
        }
    }

    useEffect(() => {
        // Initial check
        checkCamera();

        // Periodically check every 5 seconds
        const intervalId = setInterval(checkCamera, 5000);

        return () => clearInterval(intervalId); // Clean up interval on unmount
    }, []);


    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {showCustomAlert && <MyAlert alert={showCustomAlert} setShowCustomAlert={setShowCustomAlert} />}
            {!isModalOpen && (
                <>
                    <QuizHeader name={user.name} title={quiz.title} quizAccessCode={quiz._id} remainingTime={remainingTime} />
                    <Pagination totalQuestions={quiz.questions.length} currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion} handleSubmit={handleSubmit} />
                    <QuestionBox question={quiz.questions[currentQuestion - 1]} selectedOption={selectedOptions[currentQuestion]} handleOptionChange={handleOptionChange} />
                </>
            )}
            <Modal open={isModalOpen} onClose={() => { }} aria-labelledby="fullscreen-modal-title" aria-describedby="fullscreen-modal-description">
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2, textAlign: 'center' }}>
                    <Typography id="fullscreen-modal-title" variant="h6" component="h2">Welcome to the Quiz</Typography>
                    <Typography id="fullscreen-modal-description" sx={{ mt: 2 }}>
                        Here are the guidelines for the quiz:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        1. Ensure your camera is turned on during the quiz.<br />
                        2. Do not switch tabs frequently; more than 3 switches will end the quiz.<br />
                        3. Complete the quiz within the allotted time.<br />
                        4. Follow all instructions given by the quiz creator.
                    </Typography>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => setIsModalOpen(false)}>Start Quiz</Button>
                </Box>
            </Modal>
            <video ref={videoRef} style={{ display: 'none' }} autoPlay />
        </Box>
    );
}

export default Quiz;
