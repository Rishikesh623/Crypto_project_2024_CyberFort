import { Box, Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

function QuizHeader({ title,name, quizAccessCode }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, background: 'linear-gradient(to right, #ff7e5f, #feb47b)', borderBottom: '1px solid #ddd' }}>
            <Typography variant="h6">
                {`${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, '0')}`}
            </Typography>

            <Typography variant="h6">{title}{" | "}{name}</Typography>
            <Typography variant="h6">Access Code: {quizAccessCode}</Typography>
        </Box>
    );
}

function Pagination({ totalQuestions, currentQuestion, setCurrentQuestion,handleSubmit }) {
    const navigate = useNavigate();
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            {Array.from({ length: totalQuestions }, (_, index) => (
                <Button
                    key={index}
                    variant={currentQuestion === index + 1 ? 'contained' : 'outlined'}
                    onClick={() => setCurrentQuestion(index + 1)}
                    sx={{ mx: 1 }}
                >
                    {index + 1}
                </Button>
            ))}
            <Button variant='contained' onClick={handleSubmit} sx={{ bgcolor: 'black' }} >Submit</Button>
        </Box>
    );
}

function Quiz() {
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});

    const { user } = useUserContext();
    const { quiz,submitQuiz } = useQuiz();
    const navigate = useNavigate();

    useEffect(()=>{
        if (quiz.participants.includes(user._id)) {
            alert('You have already participated in this quiz.');
            navigate(-1);
            return;
         }
    },[quiz])
   
    const questions = quiz.questions;

    const handleOptionChange = (event) => {
        const newSelectedOptions = { ...selectedOptions, [currentQuestion]: event.target.value };
        setSelectedOptions(newSelectedOptions);
    };

    const handleSubmit = async () => {
        const info = {
            quizId:quiz._id,
            selectedOptions: selectedOptions,
        };
        const res = await submitQuiz(info);
        if(res?.error){
            alert("Quiz Submitted Successfully!!!.Now you will be redirected to home page.");
            return ;
        }
        alert("Quiz Submitted Successfully!!!.Now you will be redirected to home page.");
        navigate('/dashboard'); 
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <QuizHeader name={user.name} title={quiz.title} quizAccessCode={quiz._id} />
            <Pagination totalQuestions={questions.length} currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion} handleSubmit={handleSubmit} />

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 4, mx: 'auto', background: '#ffffff', borderRadius: '8px', border: '2px solid #ddd', borderBottom: '4px solid #ff7e5f', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', maxWidth: '800px', width: '100%', textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 4 }}>{questions[currentQuestion - 1].question}</Typography>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Options</FormLabel>
                    <RadioGroup value={selectedOptions[currentQuestion] || ''} onChange={handleOptionChange}>
                        {questions[currentQuestion - 1].options.map((option, index) => (
                            <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                        ))}
                    </RadioGroup>
                </FormControl>
            </Box>
        </Box>
    );
}

export default Quiz;
