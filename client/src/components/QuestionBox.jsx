// components/QuestionBox.js
import { Box, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

function QuestionBox({ question, selectedOption, handleOptionChange }) {
    return (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 4, mx: 'auto', background: '#ffffff', borderRadius: '8px', border: '2px solid #ddd', borderBottom: '4px solid #ff7e5f', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', maxWidth: '800px', width: '100%', textAlign: 'center' }}>
            <Typography variant="h4" sx={{ mb: 4 }}>{question.question}</Typography>
            <FormControl component="fieldset">
                <FormLabel component="legend">Options</FormLabel>
                <RadioGroup value={selectedOption || ''} onChange={handleOptionChange}>
                    {question.options.map((option, index) => (
                        <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                    ))}
                </RadioGroup>
            </FormControl>
        </Box>
    );
}

export default QuestionBox;
