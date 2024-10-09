import React from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, CssBaseline } from '@mui/material';
import { Outlet, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import CreateIcon from '@mui/icons-material/Create';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';



const drawerWidth = 240;

const User = () => {
    const [username, setUsername] = React.useState('Guest'); // Replace with actual user data

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
                    <ListItem button component={Link} to={'/create-quiz'} key={'create-quiz'}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slight white overlay on hover
                            },
                        }}>
                        <ListItemText primary={'Create Quiz'} sx={{ color: 'white' }} />
                    </ListItem>
                    <ListItem button component={Link} to={'/quiz/:quizId'} key={'give-quiz'}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slight white overlay on hover
                            },
                        }}>
                        <ListItemText primary={'Give Quiz'} sx={{ color: 'white' }} />
                    </ListItem>
                    <ListItem button component={Link} to={'/view-result'} key={'view-result'}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slight white overlay on hover
                            },
                        }}>
                        <ListItemText primary={'View Results'} sx={{ color: 'white' }} />
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
            </main>
        </div>
    );
};

export default User;
