import {
    Box,
    Typography,
    Card,
    CardContent,
    Container,
    Button,
    TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { useUserContext } from '../contexts/UserContext';

const QuizView = () => {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const { quiz, result, updateQuiz } = useQuiz();

    const [isEditing, setIsEditing] = useState(false);
    const [changes, setChanges] = useState({});

    // Function to format date-time to "yyyy-MM-ddThh:mm"
    function formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    }

    // Toggle editing mode
    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
        setChanges({});
    };

    // Handle input changes
    const handleInputChange = (e, field, index, optionIndex = null) => {
        const value = e.target.value;
        const newChanges = { ...changes };

        if (field === 'title' || field === 'description' || field === 'start_time' || field === 'end_time') {
            newChanges[field] = value;
        } else if (field === 'question') {
            if (!newChanges.questions) newChanges.questions = [...quiz.questions];
            newChanges.questions[index] = {
                ...newChanges.questions[index],
                question: value,
            };
        } else if (field === 'option') {
            if (!newChanges.questions) newChanges.questions = [...quiz.questions];
            const updatedOptions = [...(newChanges.questions[index]?.options || quiz.questions[index].options)];
            updatedOptions[optionIndex] = value;

            newChanges.questions[index] = {
                ...newChanges.questions[index],
                options: updatedOptions,
            };
        }

        setChanges(newChanges);
    };

    // Handle Save changes
    const handleSave = async () => {
        const quizId = quiz._id; // Retrieve quizId from the quiz object
        const res = await updateQuiz(quizId, changes); // Pass quizId and changes to updateQuiz function

        if (res?.error) {
            alert("Error occurred while updating.");
            return;
        } else {

            alert("Quiz successfully edited");
        }
        setIsEditing(false);
        setChanges({});
    };


    
    return (
        <Box sx={{ background: 'linear-gradient(to right, #ff7e5f, #feb47b)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Container maxWidth="md" sx={{ backgroundColor: 'white', borderRadius: 2, padding: 3, boxShadow: 2 }}>
            <Typography align='right' sx={{ color: 'gray' }}>*Don't reload the page.</Typography>
            <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(-1)}
                    sx={{ mb: 3 }}
                >
                    Back
                </Button>

                {quiz.end_time >= (new Date().toISOString()) && (quiz.created_by === user._id) &&
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={isEditing ? handleSave : handleEditToggle}
                        sx={{ mb: 3, ml: 2 }}
                    >
                        {isEditing ? 'Save' : 'Edit Quiz'}
                    </Button>
                }


                

                {/* Quiz Title, Description, Start Time, and End Time */}
                <Box sx={{ mb: 4, p: 3, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 1 }}>
                    {isEditing ? (
                        <>
                            <TextField
                                variant="outlined"
                                fullWidth
                                label="Quiz Title"
                                defaultValue={quiz.title}
                                onChange={(e) => handleInputChange(e, 'title')}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                variant="outlined"
                                fullWidth
                                label="Description"
                                defaultValue={quiz.description}
                                onChange={(e) => handleInputChange(e, 'description')}
                                multiline
                                rows={3}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                variant="outlined"
                                fullWidth
                                label="Start Time"
                                type="datetime-local"
                                defaultValue={formatDateTime(quiz.start_time)}
                                onChange={(e) => handleInputChange(e, 'start_time')}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                variant="outlined"
                                fullWidth
                                label="End Time"
                                type="datetime-local"
                                defaultValue={formatDateTime(quiz.end_time)}
                                onChange={(e) => handleInputChange(e, 'end_time')}
                                sx={{ mb: 2 }}
                            />
                        </>
                    ) : (
                        <>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
                                {quiz.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                                {quiz.description}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                                <strong>Start Time:</strong> {new Date(quiz.start_time).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555' }}>
                                <strong>End Time:</strong> {new Date(quiz.end_time).toLocaleString()}
                            </Typography>
                        </>
                    )}
                </Box>

                {/* Display Questions and Options */}
                {quiz.questions.map((question, index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                        <CardContent>
                            {isEditing ? (
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    label={`Question ${index + 1}`}
                                    defaultValue={question.question}
                                    onChange={(e) => handleInputChange(e, 'question', index)}
                                    sx={{ mb: 2 }}
                                />
                            ) : (
                                <Typography variant="h6">
                                    Question {index + 1}:
                                </Typography>
                            )}

                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {question.question}
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                {question.options.map((option, optionIndex) => {
                                    const selectedOption = result?.selected_options ? result.selected_options[index + 1] : null;
                                    const isCorrect = option === question.correct_option;
                                    const isSelected = option === selectedOption;
                                    const backgroundColor = isCorrect
                                        ? (isSelected 
                                            ?'darkgreen'
                                            :' lightgreen')
                                        :( isSelected
                                            ? 'lightcoral'
                                            : 'transparent');

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
                                                            : '#f5f5f5',
                                                },
                                            }}
                                        >
                                            {isEditing ? (
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    label={`Option ${optionIndex + 1}`}
                                                    defaultValue={option}
                                                    onChange={(e) => handleInputChange(e, 'option', index, optionIndex)}
                                                />
                                            ) : (
                                                <Typography variant="body1" sx={{ fontWeight: 'normal' }}>
                                                    {option}
                                                </Typography>
                                            )}
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
