import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Divider, Paper } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useParams, useNavigate } from 'react-router-dom'; // Assuming react-router-dom is used for navigation
import io from 'socket.io-client';
import { useQuiz } from '../contexts/QuizContext';

const QuizMonitor = () => {

    const { quiz, getQuiz, blockParticipant, unBlockParticipant } = useQuiz();
    const { id } = useParams();
    const [participants, setParticipants] = useState([]);
    const [timeLeft, setTimeLeft] = useState("");
    const [participantsStream, setParticipantsStream] = useState({});
    const peerConnections = useRef({});
    const videoRefs = useRef({});
    const [showVideos, setShowVideos] = useState(false);

    useEffect(() => {
        getQuiz(id);

    }, []);
    useLayoutEffect(() => {
        participants.forEach(participant => {
            if (!videoRefs.current[participant.pid]) {
                videoRefs.current[participant.pid] = React.createRef();
                console.log(`Video ref created for participant ${participant.pid}`);
                console.log(videoRefs.current[participant.pid]);
            }
        });
    }, [participants]);

    const socket = useRef(null);
    useEffect(() => {
        //connect socket only once on load
        socket.current = io("http://localhost:4000");

        //emit joinQuizMonitor event to join the quiz room as creator
        socket.current.emit("joinQuizAsCreator", quiz?._id);

        //listen for new participants joining
        socket.current.on("participantJoined", (data) => {
            setParticipants(data);
        });

        //listen violated partcipants blocking
        socket.current.on("blockParticipant", ({ pid, updatedParticipantsList }) => {
            setParticipants(updatedParticipantsList);

            removeparticipant(pid);
        });

        socket.current.on("quizSubmitUpdate", ({ updatedParticipantsList }) => {
            setParticipants(updatedParticipantsList);
        });

        // socket.current.on("participantStream", ({ pid, stream }) => {
        //     // Handle incoming video stream
        //     console.log(stream);
        //     setParticipantStreams(prev => ({ ...prev, [pid]: stream }));
        // });

        // Listen for offers from participants
        socket.current.on('receive-offer', async (data) => {
            const quizId = quiz._id;
            const { offer, pid } = data;
            const peerConnection = new RTCPeerConnection();

            peerConnections.current[pid] = peerConnection;



            // Add an event listener for when we receive the participant's video stream
            peerConnection.ontrack = (event) => {


                // Set a timeout to ensure the DOM ref has been created and attached
                setTimeout(() => {
                    const videoElement = document.getElementById(`video-${pid}`);

                    if (videoElement) {
                        videoElement.srcObject = event.streams[0];
                        setParticipantsStream(prev => ({
                            ...prev,
                            [pid]: event.streams[0],
                        }));
                    } else {
                        console.error(`Video element not found for participant ${pid}`);
                    }
                }, 100); // Adjust the delay if necessary
            };

            // Set the received offer as the remote description
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

            // Create an answer and set it as the local description
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            // Send the answer back to the participant
            socket.current.emit('answer', { answer, pid, quizId });

            // Handle ICE candidates from the participant
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.current.emit('ice-candidate', { target: 'quiz-partcipant', candidate: event.candidate, pid: pid, quizId: quizId });
                }
            };
        });

        // Handle incoming ICE candidates from participants
        socket.current.on('receive-ice-candidate', async (data) => {
            const { pid, candidate } = data;
            const iceCandidate = new RTCIceCandidate(candidate);
            if (pid)
                peerConnections.current[pid].addIceCandidate(iceCandidate);
        });

        // Calculate remaining time based on quiz end time
        const calculateTimeLeft = () => {
            const timeDiff = new Date(quiz.end_time) - new Date();
            if (timeDiff > 0) {
                const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
                const seconds = Math.floor((timeDiff / 1000) % 60);
                setTimeLeft(`${minutes}m ${seconds}s`);
            } else {
                setTimeLeft("Time's up");
            }
        };

        // Update time remaining every second
        const timerInterval = setInterval(calculateTimeLeft, 1000);

        //clean up socket on component unmount
        return () => {
            clearInterval(timerInterval);
            socket.current.disconnect();
            // Cleanup
            // Object.values(peerConnections.current).forEach((pc) => pc.close());
        };
    }, [socket, quiz?._id]);

    const navigate = useNavigate();


    const removeparticipant = (pid) => {

        const quizId = quiz._id;

        const res = blockParticipant(pid, quizId);

        if (res.error) {
            alert("Error occurred !!! ");
            return;
        }

        // console.log(participants);

        // const existingParticipantIndex = participants.findIndex(
        //     (participant) => participant.pid === pid
        // );

        // // console.log(existingParticipantIndex);
        // participants[existingParticipantIndex]["blocked"] = true;

    };

    const handleblockParticipant = (pid) => {
        const quizId = quiz._id;

        console.log(pid);
        socket.current.emit("blockParticipant", { quizId, pid });
    }

    const allowParticipant = (pid) => {

        const quizId = quiz._id;

        const res = unBlockParticipant(pid, quizId);

        if (res.error) {
            alert("Error occurred !!! ");
            return;
        }


        const existingParticipantIndex = participants.findIndex(
            (participant) => participant.pid === pid
        );

        participants[existingParticipantIndex]["blocked"] = false;

        socket.current.emit("unBlockParticipant", { quizId, pid });

    };

    const goBack = () => {
        navigate(-1); // Go back to the previous page
    };

    const scrollToVideos = () => {
        const videoSection = document.getElementById("video-section");
        if (videoSection) {
            const sectionPosition = videoSection.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: sectionPosition - (window.innerHeight / 2) + (videoSection.clientHeight / 2), // Center the video section in the viewport
                behavior: 'smooth'
            });
        }
    };
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
                    minHeight: '100vh',
                    padding: 3,
                }}
            >
                {/* Header with Quiz Timer */}
                <Paper elevation={3} sx={{ padding: 3, width: '100%', maxWidth: '800px', marginBottom: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
                        {quiz?.title}
                    </Typography>

                    <Typography variant="body1" sx={{ color: '#0000FF', mb: 1 }}>
                        # QuizId{" "}{quiz?._id}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                        {quiz?.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            Time Left :
                            <AccessTimeIcon sx={{ marginRight: 1 }} />
                            <Typography variant="h6" color={timeLeft === "Time's up" ? 'red' : 'green'}>
                                {timeLeft}
                            </Typography>
                        </Box>
                        <Typography >
                            {`Total participants : ${participants?.length}`}
                        </Typography>
                    </Box>

                    <hr />
                    <Typography variant="body2" color="textSecondary">
                        Monitoring participants in real-time. Violations, if any, will appear below.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={scrollToVideos}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {showVideos ? 'Hide stream' : 'Watch participants stream'}
                    </Button>
                </Paper>

                <Paper elevation={3} sx={{ padding: 3, width: '100%', maxWidth: '800px' }}>
                    <Typography variant="h5" gutterBottom>Participants </Typography>
                    <Divider sx={{ marginBottom: 2 }} />
                    <List>
                        {participants && participants.length > 0 ? (
                            participants.map((participant, index) => (
                                <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <ListItemText
                                        primary={`${participant.pName}`}
                                        secondary={`email: ${participant.pEmail}`}
                                        tertiary={"frfrf"}
                                    />

                                    <Typography
                                        variant="body2"
                                        color={participant.submitted ? "green" : "red"}
                                        sx={{ marginRight: 2 }}
                                    >
                                        {participant.submitted ? "Submitted" : "Not Submitted"}
                                    </Typography>
                                    {!participant.blocked ? (
                                        <Button variant="outlined" onClick={() => handleblockParticipant(participant.pid)} color="primary" >
                                            Block
                                        </Button>
                                    ) : (
                                        <Button variant="outlined" onClick={() => allowParticipant(participant.pid)} color="secondary" >
                                            UnBlock
                                        </Button>
                                    )}
                                </ListItem>

                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary">No participants connected yet.</Typography>
                        )}
                    </List>
                </Paper>

            </Box>

            <Box id="video-section" sx={{ minHeight: '100vh', overflowY: 'auto' }}>

                <Box
                    mt={4}
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
                        padding: 3
                    }}
                >
                    <Typography variant="h5" sx={{ width: '100%', textAlign: 'center', mb: 2, color: '#fff' }}>
                        Participant Streams
                    </Typography>
                    {participants.map((participant) => (
                        <Box
                            key={participant.pid}
                            sx={{
                                mb: 2,
                                mx: 1,
                                background: '#fff',
                                borderRadius: '8px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                overflow: 'hidden',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.05)', // Hover effect
                                },
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ padding: 1, color: '#333' }}>
                                Participant name:  {participant.pName}
                            </Typography>
                            <video
                                id={`video-${participant.pid}`}
                                ref={(el) => { videoRefs.current[participant.pid] = el; }}
                                autoPlay
                                playsInline
                                style={{
                                    width: '350px',
                                    height: '150px',
                                    border: 'none',
                                }}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>


        </>
    );
};

export default QuizMonitor;
