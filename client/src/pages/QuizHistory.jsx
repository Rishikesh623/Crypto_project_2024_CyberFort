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
    const { createdQuizzes,givenQuizzes,getQuiz,getdetailedQuizResult, getQuizResult } = useQuiz();
    
    const navigate = useNavigate();

    const handleViewQuiz_created = async (quizId) => {
      await getQuiz(quizId);  
      navigate("../quiz/view-quiz");     
    }
    const handleViewQuiz_given = async (quizId) => {
      await getdetailedQuizResult(quizId);
      navigate("../quiz/view-quiz");        
    }

    const handleViewResult_created= () => {
      navigate("./quiz-result");
    }
    const handleViewResult_given = async (quizId) => {
      
        const resultData = await getQuizResult(quizId);
        resultData['submissionDate'] = convert(resultData.submitted_at);
        resultData['submissionTime'] = new Date(resultData.submitted_at).toLocaleTimeString();
        navigate("./quiz-result", { state: resultData });
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
                                    <Button variant="contained" color="primary" onClick={() => handleViewQuiz_created(quiz._id)}>View Quiz</Button>
                                    <Button variant="outlined" color="secondary" onClick={handleViewResult_created}>View Results</Button>
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
                            <Paper key={quiz._id} sx={{ p: 2, mb: 2 }}>
                                <Typography variant="body1">Name: {quiz.title}</Typography>
                                <Typography variant="body2" color="textSecondary">Date: {convert(quiz.createdAt)}</Typography>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button variant="contained" color="primary" onClick={() => handleViewQuiz_given(quiz._id)}>View Quiz</Button>
                                    <Button variant="outlined" color="secondary" onClick={() => handleViewResult_given(quiz._id)}>View Result</Button>
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
