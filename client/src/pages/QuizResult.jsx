import React from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { CheckCircle, CalendarToday, QuestionAnswer, AccessTime } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';



const CreatedQuizResults = ({resultData}) => {
    const navigate = useNavigate();
    // console.log(resultData);

    const { title, datetime, totalQuestions, participantsCount, participants } = resultData;

    return (
        <Box sx={{ padding: 3 }}>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate(-1)} // Navigate back to the previous page
                sx={{ mb: 3 }} // Margin bottom for spacing
            >
                Back
            </Button>

            <Card sx={{ mb: 2, backgroundColor: 'white' }}>
                <CardContent>
                    <Typography variant="h4">{title}</Typography>
                    <Typography variant="body1">Date of Occurrence: {new Date(datetime).toLocaleDateString()}</Typography>
                    <Typography variant="body1">Total Questions: {totalQuestions}</Typography>
                    <Typography variant="body1">Number of Participants: {participantsCount}</Typography>
                </CardContent>
            </Card>

            {/* Participants Table */}
            {participants.length > 0 && (
                <Card sx={{ mb: 2, backgroundColor: 'white' }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>Participants</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Name</strong></TableCell>
                                        <TableCell><strong>Total Correct Answers</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {participants.map((participant, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{participant.name}</TableCell>
                                            <TableCell>{participant.total_correct}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};
const GivenQuizResults = ({resultData}) => {
    const navigate = useNavigate();
    const {getdetailedQuizResult} = useQuiz();

    const handleViewQuiz_given = async () => {
        const quizId = resultData.quiz_id;
        const res = await getdetailedQuizResult(quizId);
        if (res?.error) {
            alert("Some error occurred");
        }
        navigate(`../quiz/view-quiz/${quizId}`);
    }

    return (
        <Box sx={{ padding: 2, backgroundColor: 'transparent', mb: 3 }}>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate(-1)} // Navigate back to the previous page
                sx={{ mb: 2 }} // Margin bottom for spacing
            >
                Back
            </Button>

            {resultData ? (
                <Card sx={{ backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 1 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {resultData.quiz_title}
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CheckCircle sx={{ color: 'green', marginRight: 1 }} />
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Correct Answers: {resultData.total_correct}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarToday sx={{ color: 'blue', marginRight: 1 }} />
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Submission Date: {new Date(resultData.submitted_at).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <QuestionAnswer sx={{ color: 'purple', marginRight: 1 }} />
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Total Questions: {resultData.total_questions}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTime sx={{ color: 'orange', marginRight: 1 }} />
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Submission Time: {new Date(resultData.submitted_at).toLocaleTimeString()}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ) : (
                <Typography variant="h6" color="error">
                    No result available to display.
                </Typography>
            )}

            {/* Note for navigating to view quiz */}
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: '#555' }}>
                NOTE: To see detailed results, go to the
                <Button
                    onClick={handleViewQuiz_given}
                    color="primary"
                    sx={{ textDecoration: 'underline', ml: 0.5 }}
                >
                    View Quiz
                </Button>
                page.
            </Typography>
        </Box>
    );
};

const QuizResult = () =>{
    const location = useLocation();
    const resultData = location.state;

    if(resultData.creator){
        return <CreatedQuizResults resultData={resultData}/>
    }
    return <GivenQuizResults resultData={resultData}/>
}
export default QuizResult;


