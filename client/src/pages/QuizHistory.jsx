import React from 'react';
import { Box, Typography, Grid, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';



const convert = (isoDate) => {
    const date = new Date(isoDate);
    const readableDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        }); 
    return readableDate;
}
const QuizHistory = () => {
    const { createdQuizzes,getQuiz } = useQuiz();
    // Example data for quizzes created and given
    const navigate = useNavigate();

    const givenQuizzes = [
        { id: 1, name: 'Web Security', date: '2024-10-02' },
        { id: 2, name: 'Encryption Techniques', date: '2024-09-28' }
    ];
    const handleViewQuiz = async (quizId) => {
      const res = await getQuiz(quizId);  
      navigate("./view-quiz");
    }

    const handleViewResult = () => {
      navigate("./quiz-result");
    }
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Quiz History</Typography>
            <Grid container spacing={4}>
                {/* Created Quizzes Section */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Quizzes Created</Typography>
                    {createdQuizzes.length > 0 ? (
                        createdQuizzes.map(quiz => (
                            <Paper key={quiz._id} sx={{ p: 2, mb: 2 }}>
                                <Typography variant="body1">Name: {quiz.title}</Typography>
                                <Typography variant="body2" color="textSecondary">Date: {convert(quiz.createdAt)}</Typography>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button variant="contained" color="primary" onClick={() => handleViewQuiz(quiz._id)}>View Quiz</Button>
                                    <Button variant="outlined" color="secondary" onClick={handleViewResult}>View Results</Button>
                                </Box>
                            </Paper>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">No quizzes created.</Typography>
                    )}
                </Grid>

                {/* Given Quizzes Section */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Quizzes Given</Typography>
                    {givenQuizzes.length > 0 ? (
                        givenQuizzes.map(quiz => (
                            <Paper key={quiz.id} sx={{ p: 2, mb: 2 }}>
                                <Typography variant="body1">Name: {quiz.name}</Typography>
                                <Typography variant="body2" color="textSecondary">Date: {quiz.date}</Typography>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button variant="contained" color="primary" onClick={handleViewQuiz}>View Quiz</Button>
                                    <Button variant="outlined" color="secondary" onClick={handleViewResult}>View Result</Button>
                                </Box>
                            </Paper>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">No quizzes given.</Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default QuizHistory;
