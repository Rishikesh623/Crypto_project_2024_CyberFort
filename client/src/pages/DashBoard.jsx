import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, Modal, TextField, Button } from '@mui/material';
import { Outlet, Link, Navigate, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import Profile from '../components/Profile';
import QuizHistory from './QuizHistory';
import QuizResult from './QuizResult';

const drawerWidth = 240;



const DashBoard = () => {
    const [username, setUsername] = React.useState('Guest'); // Replace with actual user data
    const [selectedOption, setSelectedOption] = useState("profile");
    const [isModalOpen, setModalOpen] = useState(false);
    const [quizId, setQuizId] = useState('');
    const navigate = useNavigate();

    const renderContent = () => {
        switch (selectedOption) {
            case 'profile':
                return <Profile/>;
            case 'quiz-history':
                return <QuizHistory/>;
            default:
                return <Profile/>;
        }
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        if (option === 'create-quiz') {
            navigate('/create-quiz');
        } else if (option == 'quiz-history') {

        } else if(option == 'give-quiz'){
            setModalOpen(true);
        }else if (option === 'logout') {
            // handle logout logic here
        }
    };

    const handleQuizAccessCodeSubmit = (e) => {
        e.preventDefault();
        // if (quizId && name && id) {
            // Redirect to quiz page after form submission
            navigate(`/quiz/${quizId}`);
            setModalOpen(false);
        // }
    };
    return (
        <div style={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: 1300, background: 'linear-gradient(to right, #ff7e5f, #feb47b)' }}>
                <Toolbar>
                    <Box
                        component="img"
                        sx={{
                            width: 50,
                            height: 'auto',
                            borderRadius: 2,
                            marginRight: 2
                        }}
                        alt="Logo"
                        src={logo}
                    />
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                        FortiQuiz
                    </Typography>
                    <Typography variant="subtitle1" sx={{ marginLeft: 2 }}>
                        {username}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
                        borderRight: 'none',
                    },
                }}
            >
                <Toolbar /> {/* To push the content below the AppBar */}
                <List>
                    <ListItem button onClick={()=>{handleOptionSelect('profile')}} key={'profile'}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slight white overlay on hover
                            },
                        }}>
                        <ListItemText primary={'Profile'} sx={{ color: 'white' }} />
                    </ListItem>
                    <ListItem button component={Link} to={'/create-quiz'} key={'create-quiz'}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slight white overlay on hover
                            },
                        }}>
                        <ListItemText primary={'Create Quiz'} sx={{ color: 'white' }} />
                    </ListItem>
                    <ListItem button onClick={()=>{handleOptionSelect('give-quiz')}} key={'give-quiz'}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slight white overlay on hover
                            },
                        }}>
                        <ListItemText primary={'Give Quiz'} sx={{ color: 'white' }} />
                    </ListItem>
                    <ListItem button onClick={()=>{handleOptionSelect('quiz-history')}} key={'quiz-history'}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slight white overlay on hover
                            },
                        }}>
                        <ListItemText primary={'Quiz History'} sx={{ color: 'white' }} />
                    </ListItem>

                </List>
            </Drawer>

            <main
                style={{
                    flexGrow: 1,
                    padding: '80px 24px 24px 24px',
                    background: '#f4f4f4', // Light gray background for contrast
                    overflowY: 'auto',
                    height: '100vh',
                }}
            >
                <Outlet />
                {renderContent()}
            </main>
            <Modal
                open={isModalOpen}
                onClose={()=>{setModalOpen(false)}}
                aria-labelledby="quiz-modal-title"
                aria-describedby="quiz-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="quiz-modal-title" variant="h6" component="h2">
                        Enter Quiz Access Code
                    </Typography>
                    <form onSubmit={handleQuizAccessCodeSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Quiz Access Code"
                            value={quizId}
                            onChange={(e) => setQuizId(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Start Quiz
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default DashBoard;
