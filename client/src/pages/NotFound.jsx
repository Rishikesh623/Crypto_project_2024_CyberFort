import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ textAlign: 'center', padding: '50px', background: '#f0f0f0', minHeight: '100vh' }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
                404 - Page Not Found
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                Oops! The page you are looking for does not exist.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/')}
            >
                Go to Home
            </Button>
        </Box>
    );
};

export default NotFound;
