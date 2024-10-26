// components/QuizHeader.js
import { Box, Typography } from '@mui/material';

function QuizHeader({ title, name, quizAccessCode, remainingTime }) {
    
    //format remaining time if provided
    const formatRemainingTime = () => {
        if (!remainingTime) return "00:00:00";
        const totalSeconds = Math.floor(remainingTime / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, background: 'linear-gradient(to right, #ff7e5f, #feb47b)', borderBottom: '1px solid #ddd' }}>
            <Typography variant="h6">
                {`${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, '0')}`}
            </Typography>
            <Typography variant="h6">{title}{" | "}{name}</Typography>
            <Typography variant="h6">Access Code: {quizAccessCode}</Typography>
            <Typography variant="h6">Time Left: {formatRemainingTime()}</Typography> {/* Display remaining time */}
        </Box>
    );
}

export default QuizHeader;
