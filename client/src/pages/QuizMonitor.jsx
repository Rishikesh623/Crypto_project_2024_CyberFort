import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Divider, Paper } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom is used for navigation
import io from 'socket.io-client';
import { useQuiz } from '../contexts/QuizContext';

const QuizQuizMonitor = () => {

    const { quiz } = useQuiz();
    const [participants, setParticipants] = useState([]);
    const [timeLeft, setTimeLeft] = useState("");

    const socket = useRef(null);
    useEffect(() => {
        //connect socket only once on load
        socket.current = io("http://localhost:4000");

        //emit joinQuizMonitor event to join the quiz room as creator
        socket.current.emit("joinQuizAsCreator", quiz._id);

        //listen for new participants joining
        socket.current.on("participantJoined", (data) => {
            setParticipants(data);
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
        };
    }, [socket, quiz._id]);

    const navigate = useNavigate();


    const removeparticipant = (id) => {
        setParticipants(prevList =>
            prevList.map(participant =>
                participant.id === id ? { ...participant, removed: true } : participant
            )
        );
    };

    const goBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
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
                    {quiz.title}
                </Typography>
                
                <Typography variant="body1" sx={{ color: '#0000FF', mb: 1 }}>
                    # QuizId{" "}{quiz._id}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                    {quiz.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Time Left :
                    <AccessTimeIcon sx={{ marginRight: 1 }} />
                    <Typography variant="h6" color={timeLeft === "Time's up" ? 'red' : 'green'}>
                        {timeLeft}
                    </Typography>
                </Box>
                <hr />
                <Typography variant="body2" color="textSecondary">
                    Monitoring participants in real-time. Violations, if any, will appear below.
                </Typography>
            </Paper>

            {/* Participants List */}
            <Paper elevation={3} sx={{ padding: 3, width: '100%', maxWidth: '800px' }}>
                <Typography variant="h5" gutterBottom>Participants</Typography>
                <Divider sx={{ marginBottom: 2 }} />
                <List>
                    {participants && participants.length > 0 ? (
                        participants.map((participant, index) => (
                            <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <ListItemText
                                    primary={`User ID: ${participant.pName}`}
                                    secondary={`Remarks: ${participant.pEmail}`}
                                />
                                <Button variant="outlined" color="secondary" disabled={participant.remarks !== "No Violation"}>
                                    Remove
                                </Button>
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">No participants connected yet.</Typography>
                    )}
                </List>
            </Paper>
        </Box>
    );
};

export default QuizQuizMonitor;
