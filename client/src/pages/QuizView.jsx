import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Container,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const QuizView = () => {
    const navigate = useNavigate(); // Hook to programmatically navigate
    const [quizTitle] = useState("General Knowledge Quiz");
    const [quizDescription] = useState("Test your knowledge on various topics with this fun quiz!");
    const [questions] = useState([
        {
            question: "What is the capital of France?",
            options: ["Paris", "London", "Berlin", "Madrid"],
            correctAnswer: "Paris",
        },
        {
            question: "What is 2 + 2?",
            options: ["3", "4", "5", "6"],
            correctAnswer: "4",
        },
        {
            question: "What is the color of the sky?",
            options: ["Blue", "Green", "Red", "Yellow"],
            correctAnswer: "Blue",
        },
        // Add more questions as needed
    ]);

    return (
        <Box sx={{ background: 'linear-gradient(to right, #ff7e5f, #feb47b)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Container maxWidth="md" sx={{ backgroundColor: 'white', borderRadius: 2, padding: 3, boxShadow: 2 }}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(-1)} // Navigate back to the previous page
                    sx={{ mb: 3 }} // Margin bottom for spacing
                >
                    Back
                </Button>
                <Typography variant="h4" gutterBottom>
                    {quizTitle}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 4 }}>
                    {quizDescription}
                </Typography>
                {questions.map((question, index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6">
                                Question {index + 1}:
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {question.question}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                {question.options.map((option, optionIndex) => (
                                    <Box
                                        key={optionIndex}
                                        sx={{
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            padding: '10px',
                                            margin: '4px 0',
                                            backgroundColor: question.correctAnswer === option ? 'lightgreen' : 'transparent',
                                            transition: 'background-color 0.3s',
                                            '&:hover': {
                                                backgroundColor: question.correctAnswer === option ? 'lightgreen' : '#f5f5f5', // Highlight on hover
                                            },
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ fontWeight: 'normal' }}>
                                            {option}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Container>
        </Box>
    );
};

export default QuizView;
