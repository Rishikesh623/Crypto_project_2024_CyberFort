import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CalendarToday, QuestionAnswer, AccessTime } from '@mui/icons-material';

const ViewResult = () => {
    const navigate = useNavigate();

    // Example result data (replace with actual data from your context or props)
    const resultData = {
        title: "General Knowledge Quiz",
        submissionDate: "2024-10-10",
        totalQuestions: 5,
        correctAnswers: 3,
        submissionTime: "2 minutes",
    };

    return (
        <Box sx={{ padding: 3, backgroundColor: '#FFA500' }}>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate(-1)} // Navigate back to the previous page
                sx={{ mb: 3 }} // Margin bottom for spacing
            >
                Back
            </Button>

            {resultData ? (
                <Card sx={{ mb: 2, backgroundColor: 'white' }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            {resultData.title}
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CheckCircle sx={{ color: 'green', marginRight: 1 }} />
                                    <Typography variant="body1">
                                        <strong>Correct Answers:</strong> {resultData.correctAnswers}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarToday sx={{ color: 'blue', marginRight: 1 }} />
                                    <Typography variant="body1">
                                        <strong>Submission Date:</strong> {resultData.submissionDate}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <QuestionAnswer sx={{ color: 'purple', marginRight: 1 }} />
                                    <Typography variant="body1">
                                        <strong>Total Questions:</strong> {resultData.totalQuestions}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTime sx={{ color: 'orange', marginRight: 1 }} />
                                    <Typography variant="body1">
                                        <strong>Submission Time:</strong> {resultData.submissionTime}
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
            <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: '#555' }}>
                NOTE: If you want to see each detail, go to the <Button onClick={() => navigate('/view-quiz')} color="primary" sx={{ textDecoration: 'underline' }}>View Quiz</Button> page.
            </Typography>
        </Box>
    );
};

export default ViewResult;
