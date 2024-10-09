import { Box, Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { useState } from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { useNavigate } from 'react-router-dom';

function QuizHeader({ id, name, quizAccessCode }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, background: 'linear-gradient(to right, #ff7e5f, #feb47b)', borderBottom: '1px solid #ddd' }}>
            <Typography variant="h6">ID: {id}</Typography>
            <Typography variant="h6">Name: {name}</Typography>
            <Typography variant="h6">Access Code: {quizAccessCode}</Typography>
        </Box>
    );
}

function Pagination({ totalQuestions, currentQuestion, setCurrentQuestion }) {
    const navigate =  useNavigate();
    const handleSubmit = () => {
        // Process the answers here if needed
        // console.log('Submitted Answers:', answers);
        
        // Redirect to the home page or results page
        alert("Quiz Submitted Successfully!!!.Now you will be redirected to home page.")
        navigate('/'); // Change this to the route you want
        // navigate('/results'); // Uncomment this if you have a results page
    };

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
            <Button variant='contained' onClick={handleSubmit} sx={{bgcolor:'black'}} >Submit</Button>
        </Box>
    );
}

function Quiz() {
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});
    const { questions, answers, selectOption } = useQuiz();

    const handleOptionChange = (event) => {
        const newSelectedOptions = { ...selectedOptions, [currentQuestion]: event.target.value };
        setSelectedOptions(newSelectedOptions);
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <QuizHeader id="123" name="John Doe" quizAccessCode="ABC123" />
            <Pagination totalQuestions={questions.length} currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion} />
            
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
