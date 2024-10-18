import {
    Box,
    Typography,
    Card,
    CardContent,
    Container,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';

const QuizView = () => {
    const navigate = useNavigate();
    const { quiz, result } = useQuiz();

    return (
        <Box sx={{ background: 'linear-gradient(to right, #ff7e5f, #feb47b)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Container maxWidth="md" sx={{ backgroundColor: 'white', borderRadius: 2, padding: 3, boxShadow: 2 }}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(-1)}
                    sx={{ mb: 3 }}
                >
                    Back
                </Button>

                {/* Quiz Title and Description */}
                <Box sx={{ mb: 4, p: 3, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
                        {quiz.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                        {quiz.description}
                    </Typography>
                </Box>

                {/* Display the quiz result summary */}
                {result && (
                    <Box sx={{ mb: 4, p: 3, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 1 }}>
                        <Typography variant="body1" sx={{ mb: 1, color: '#555' }}>
                            <strong>Total Correct:</strong> {result.total_correct}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1, color: '#555' }}>
                            <strong>Total Questions:</strong> {result.total_questions}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#555' }}>
                            <strong>Submitted At:</strong> {new Date(result.submitted_at).toLocaleString()}
                        </Typography>
                    </Box>
                )}



                {/* Display Questions and Options */}
                {quiz.questions.map((question, index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6">
                                Question {index + 1}:
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {question.question}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                {question.options.map((option, optionIndex) => {
                                    const selectedOption = result?.selected_options[index + 1]; // Get the selected option for this question

                                    // Determine option background color
                                    const isCorrect = option === question.correct_option;
                                    const isSelected = option === selectedOption;
                                    const backgroundColor = isCorrect
                                        ? 'lightgreen' // Correct options in green
                                        : isSelected
                                            ? 'lightcoral' // Wrong selected options in red
                                            : 'transparent'; // Other options transparent

                                    return (
                                        <Box
                                            key={optionIndex}
                                            sx={{
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                padding: '10px',
                                                margin: '4px 0',
                                                backgroundColor: backgroundColor,
                                                transition: 'background-color 0.3s',
                                                '&:hover': {
                                                    backgroundColor: isCorrect
                                                        ? 'lightgreen'
                                                        : isSelected
                                                            ? 'lightcoral'
                                                            : '#f5f5f5', // Highlight on hover
                                                },
                                            }}
                                        >
                                            <Typography variant="body1" sx={{ fontWeight: 'normal' }}>
                                                {option}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Container>
        </Box>
    );
};

export default QuizView;
