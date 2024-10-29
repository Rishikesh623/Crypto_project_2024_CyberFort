import React, { useEffect } from 'react';
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
    const {setQuiz,setResult, createdQuizzes, getCreatedQuizHistory, getGivenQuizHistory, givenQuizzes, getQuiz, getdetailedQuizResult, getQuizResult, getCreatedQuizResults } = useQuiz();

    useEffect(() => {
        // fetch created and given quiz history when the component mounts
        getCreatedQuizHistory();
        getGivenQuizHistory();
        setQuiz(null);
        setResult(null);
    }, []);  // Empty dependency array to run the effect only once after mounting

    const navigate = useNavigate();

    const handleViewQuiz_created = async (quizId) => {
        const res = await getQuiz(quizId);
        if (res?.error) {
            alert("Some error occurred");
        }
        navigate("../quiz/view-quiz");
    }
    const handleViewQuiz_given = async (quizId) => {
        const res = await getdetailedQuizResult(quizId);
        if (res?.error) {
            alert("Some error occurred");
        }
        navigate("../quiz/view-quiz");
    }

    const handleViewResult_created = async (quizId) => {
        const resultData = await getCreatedQuizResults(quizId);
        resultData['creator'] = true;
        navigate("./quiz-result", { state: resultData });
    }
    const handleViewResult_given = async (quizId) => {

        const resultData = await getQuizResult(quizId);
        resultData['creator'] = false;
        navigate("./quiz-result", { state: resultData });
    }

    const handleMonitor = async (quizId) => {
        const res = await getQuiz(quizId);
        if (res?.error) {
            alert("Some error occurred");
        }
        navigate('/dashboard/quiz-monitor');
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
                                <Typography variant="body2" color="textSecondary">Date: {convert(quiz.end_time)}</Typography>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button variant="contained" color="primary" onClick={() => handleViewQuiz_created(quiz._id)}>View Quiz</Button>
                                    {(quiz.end_time>=(  new Date().toISOString()))?
                                        <Button variant="outlined" color="secondary" onClick={() => handleMonitor(quiz._id)}>Monitor</Button>:
                                        <Button variant="outlined" color="secondary" onClick={() => handleViewResult_created(quiz._id)}>View Results</Button>
                                         }
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
                                <Typography variant="body2" color="textSecondary">Date: {convert(quiz.end_time)}</Typography>
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
