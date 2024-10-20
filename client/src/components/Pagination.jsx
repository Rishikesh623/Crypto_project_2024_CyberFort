// components/Pagination.js
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Pagination({ totalQuestions, currentQuestion, setCurrentQuestion, handleSubmit }) {
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

export default Pagination;
