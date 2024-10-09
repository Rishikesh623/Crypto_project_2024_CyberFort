import React, { useState, useRef } from 'react';
import {Container,Typography,TextField,Button,Paper,Grid,IconButton,} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';

const QuizCreationPage = () => {
    const [quizTitle, setQuizTitle] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [questions, setQuestions] = useState([{ question: '', options: [''] }]);
    const lastQuestionRef = useRef(null); // Ref to track the last question
    const navigate = useNavigate();

    const handleQuizTitleChange = (event) => {
        setQuizTitle(event.target.value);
    };

    const handleQuizDescriptionChange = (event) => {
        setQuizDescription(event.target.value);
    };

    const handleQuestionChange = (index, event) => {
        const newQuestions = [...questions];
        newQuestions[index].question = event.target.value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, event) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = event.target.value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { question: '', options: [''] }]);
        setTimeout(() => {
            lastQuestionRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 0); // Scroll to the last question after it is rendered
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const addOption = (index) => {
        const newQuestions = [...questions];
        newQuestions[index].options.push('');
        setQuestions(newQuestions);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle quiz submission (e.g., send data to backend)
        console.log({ quizTitle, quizDescription, questions });
        alert("Quiz created successFully");
        navigate(-1);
    };

    return (
        <Container
            maxWidth="100%"
            style={{
                background: 'linear-gradient(to right, #ff7e5f, #feb47b)', // Gradient background for the window
                minHeight: '100vh', // Ensure full height of the viewport
                display: 'flex', // Center the content
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
            }}
        >
            <Paper elevation={3} style={{ maxWidth: '600px', padding: '20px', backgroundColor: 'white' }}> {/* White background for the form */}
                <Typography variant="h4" gutterBottom>
                    Create a New Quiz
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Quiz Title"
                        variant="outlined"
                        fullWidth
                        value={quizTitle}
                        onChange={handleQuizTitleChange}
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={quizDescription}
                        onChange={handleQuizDescriptionChange}
                        margin="normal"
                    />

                    {questions.map((question, index) => (
                        <Paper
                            key={index}
                            style={{ padding: '16px', marginBottom: '16px' }}
                            ref={index === questions.length - 1 ? lastQuestionRef : null} // Assign ref to the last question
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label={`Question ${index + 1}`}
                                        variant="outlined"
                                        fullWidth
                                        value={question.text}
                                        onChange={(event) => handleQuestionChange(index, event)}
                                        required
                                    />
                                    <IconButton onClick={() => removeQuestion(index)}>
                                        <RemoveIcon />
                                    </IconButton>
                                </Grid>

                                {question.options.map((option, optionIndex) => (
                                    <Grid item xs={12} key={optionIndex}>
                                        <TextField
                                            label={`Option ${optionIndex + 1}`}
                                            variant="outlined"
                                            fullWidth
                                            value={option}
                                            onChange={(event) => handleOptionChange(index, optionIndex, event)}
                                            required
                                        />
                                    </Grid>
                                ))}
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        onClick={() => addOption(index)}
                                        startIcon={<AddIcon />}
                                    >
                                        Add Option
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={addQuestion}
                        startIcon={<AddIcon />}
                    >
                        Add Question
                    </Button>
                    <br />
                    <Button variant="contained" color="primary" type="submit" style={{ marginTop: '16px' }}>
                        Create Quiz
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default QuizCreationPage;
