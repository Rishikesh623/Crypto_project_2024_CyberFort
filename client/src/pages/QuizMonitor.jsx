import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Divider, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom is used for navigation

// Mock Data Example
const quizDetails = {
    name: "Cybersecurity Quiz",
    description: "A quiz on basic cybersecurity principles.",
    timeLeft: "10:15", // Replace with real-time countdown logic
    isCompleted: false,
};

const students = [
    { name: 'John Doe', id: '123', remarks: 'No violations', removed: false },
    { name: 'Jane Smith', id: '456', remarks: 'Tab switched', removed: false },
    { name: 'Sam Wilson', id: '789', remarks: 'Multiple faces detected', removed: true },
];

const QuizMonitor = () => {
    const [studentList, setStudentList] = useState(students);
    const navigate = useNavigate(); // For navigating between routes

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
        </Box>
    );
};

export default QuizMonitor;
