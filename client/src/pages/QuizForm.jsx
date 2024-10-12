import React, { useState, useRef } from 'react';
import { Container, Typography, TextField, Button, Paper, Grid, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';
import {useQuiz} from '../contexts/QuizContext';


const QuizForm = () => {
    const [quizTitle, setQuizTitle] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [questions, setQuestions] = useState([{ question: '', options: [''] }]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const lastQuestionRef = useRef(null);
    const navigate = useNavigate();
    const {createQuiz} = useQuiz();

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
        }, 0);
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Handle quiz submission (e.g., send data to backend)
        const quizData = {
            title: quizTitle,
            description: quizDescription,
            questions: questions.map((q,index) => ({
                _id:index+1,
                question: q.question,
                options: q.options,
                correct_option: q.options[0], // Set the correct option to the first option
            })),
            start_time: startTime,
            end_time: endTime,
        };
        const res = createQuiz(quizData);
        if(!res.error){
            alert("Quiz created successfully");
            navigate("/dashboard/quiz-monitor")
        }else{
            alert("Error occurred");
        }
        // navigate(-1);
    };

    return (
        <Container
            maxWidth="100%"
            style={{
                background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Paper elevation={3} style={{ maxWidth: '600px', padding: '20px', backgroundColor: 'white' }}>
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
                            ref={index === questions.length - 1 ? lastQuestionRef : null}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label={`Question ${index + 1}`}
                                        variant="outlined"
                                        fullWidth
                                        value={question.question}
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
                                            label={`Option ${optionIndex + 1} ${optionIndex === 0 ? '(Correct Answer)' : ''}`}
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
                    <TextField
                        label="Start Time"
                        type="datetime-local"
                        variant="outlined"
                        fullWidth
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        margin="normal"
                        required
                        InputLabelProps={{shrink:true}}
                    />
                    <TextField
                        label="End Time"
                        type="datetime-local"
                        variant="outlined"
                        fullWidth
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        margin="normal"
                        required
                        InputLabelProps={{shrink:true}}
                    />
                    <Button variant="contained" color="primary" type="submit" style={{ marginTop: '16px' }}>
                        Create Quiz
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default QuizForm;
