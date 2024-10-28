import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Divider, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom is used for navigation
import io from 'socket.io-client';

// Replace with your server URL and quiz ID
const socket = null;

const QuizMonitor = () => {
    const [studentList, setStudentList] = useState([]);
    const [quizDetails, setQuizDetails] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Join the quiz room
        socket.emit('joinQuiz', { quizId: 'YOUR_QUIZ_ID' });

        // Listen for candidate updates
        socket.on('candidateListUpdate', (candidates) => {
            setStudentList(candidates);
        });

        // Listen for violation events
        socket.on('violationEvent', (event) => {
            console.log(event); // Log violation event
            // Save to logs (implement logging here)
        });

        // Clean up on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    const removeStudent = (id) => {
        setStudentList(prevList =>
            prevList.map(student =>
                student.id === id ? { ...student, removed: true } : student
            )
        );
    };

    const goBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <Box
            sx={{
                background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
                minHeight: '100vh',
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {/* Back Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={goBack}
                sx={{ alignSelf: 'flex-start', marginBottom: 2 }}
            >
                Back
            </Button>

            {/* Quiz Details */}
            <Paper elevation={3} sx={{ padding: 3, maxWidth: '800px', width: '100%', marginBottom: 4 }}>
                <Typography variant="h4" gutterBottom>{quizDetails.name}</Typography>
                <Typography variant="body1" gutterBottom>{quizDetails.description}</Typography>
                <Typography variant="h6" color={quizDetails.isCompleted ? 'green' : 'red'}>
                    {quizDetails.isCompleted ? 'Completed' : `Time Left: ${quizDetails.timeLeft}`}
                </Typography>
            </Paper>

            {/* Students List */}
            <Paper elevation={3} sx={{ padding: 3, maxWidth: '800px', width: '100%' }}>
                <Typography variant="h5" gutterBottom>Students</Typography>
                <Divider sx={{ marginBottom: 2 }} />
                <List>
                    {studentList.map((student, index) => (
                        <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                                <ListItemText primary={student.name} secondary={`ID: ${student.id}`} />
                                <Typography variant="body2" color={student.remarks !== 'No violations' ? 'red' : 'green'}>
                                    {student.remarks}
                                </Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                color="secondary"
                                disabled={student.removed}
                                onClick={() => removeStudent(student.id)}
                                sx={{ marginLeft: '20px' }}
                            >
                                {student.removed ? 'Removed' : 'Remove'}
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* See Video Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/live-video/YOUR_QUIZ_ID`)} // Redirect to the video stream page
                sx={{ marginTop: 2 }}
            >
                See Video
            </Button>
        </Box>
    );
};

export default QuizMonitor;
