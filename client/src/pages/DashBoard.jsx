import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, Modal, TextField, Button } from '@mui/material';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import logo from '../assets/logo.png';
import Profile from '../components/Profile';
import QuizHistory from './QuizHistory';
import { useQuiz } from '../contexts/QuizContext';
import QuizResult from './QuizResult';
import MyAlert from '../components/MyAlert';

const drawerWidth = 240;

const DashBoard = ({ selectedOption }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [quizId, setQuizId] = useState('');

    const { user, logout } = useUserContext();
    const { quiz, getCreatedQuizHistory, getGivenQuizHistory, getQuiz } = useQuiz();
    const [showCustomAlert, setShowCustomAlert] = useState(null); // Custom alert state

    const navigate = useNavigate();

    const renderContent = () => {
        // console.log(user);
        switch (selectedOption) {
            case 'profile':
                return <Profile />;
            case 'quiz-history':
                return <QuizHistory />;
            case 'quiz-result':
                return <QuizResult />
            default:
                return <Profile />;
        }
    };

    const handleOptionSelect = (option) => {
        // setSelectedOption(option);
        if (option === 'create-quiz') {
            navigate('/create-quiz');
        } else if (option === 'give-quiz') {
            setModalOpen(true);
            return;
        }
        navigate(`/dashboard/${option}`);
    };

    const handleQuizAccessCodeSubmit = async (e) => {
        e.preventDefault();

        const res = await getQuiz(quizId); // Fetch quiz details
        if (!res || res?.error) {
            alert(!res ? "Wrong access code. Please enter again." : res.message);
            return;
        }
;
        //extract the start and end times from the response
        const { start_time, end_time } = res; // Adjust as per your API response structure

        //get the current time
        const currentTime = new Date();

        //convert start and end times to Date objects
        const start = new Date(start_time);
        const end = new Date(end_time);

        //check if the current time is within the allowed interval
        if (currentTime < start) {
            setShowCustomAlert({ type: "info", title: "Info", message: "The quiz hasn't started yet. Please check the start time." });
            return;
        } else if (currentTime > end) {
            setShowCustomAlert({ type: "info", title: "Info", message: "The quiz has already ended." });
            return;
        }

        //if already given the quiz
        if (res.participants.includes(user._id)) {
            setShowCustomAlert({ type: "info", title: "Info", message: "You have already participated in this quiz." });
            return;
        }
        //if within the interval & not submitted , proceed to the quiz
        navigate(`/quiz/${quizId}`);
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
                        {user?.name ? user.name : "Guest"}
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
                    <ListItem button="true" onClick={() => { handleOptionSelect('profile') }} key={'profile'}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slight white overlay on hover
                            },
                        }}>
                        <ListItemText primary={'Profile'} sx={{ color: 'white' }} />
                    </ListItem>
                    <ListItem button="true" component={Link} to={'/create-quiz'} key={'create-quiz'}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slight white overlay on hover
                            },
                        }}>
                        <ListItemText primary={'Create Quiz'} sx={{ color: 'white' }} />
                    </ListItem>
                    <ListItem button="true" onClick={() => { handleOptionSelect('give-quiz') }} key={'give-quiz'}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slight white overlay on hover
                            },
                        }}>
                        <ListItemText primary={'Give Quiz'} sx={{ color: 'white' }} />
                    </ListItem>
                    <ListItem button="true" onClick={() => { handleOptionSelect('quiz-history') }} key={'quiz-history'}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slight white overlay on hover
                            },
                        }}>
                        <ListItemText primary={'Quiz History'} sx={{ color: 'white' }} />
                    </ListItem>
                    <ListItem button="true" onClick={() => { logout() }} key={'logout'}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slight white overlay on hover
                            },
                        }}>
                        <ListItemText primary={'Logout'} sx={{ color: 'white' }} />
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
                onClose={() => { setModalOpen(false) }}
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
                    {showCustomAlert !== null && (
                        <MyAlert alert={showCustomAlert} setShowCustomAlert={setShowCustomAlert} />
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default DashBoard;
