// components/QuizHeader.js
import { Box, Typography } from '@mui/material';

function QuizHeader({ title, name, quizAccessCode }) {
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

export default QuizHeader;
