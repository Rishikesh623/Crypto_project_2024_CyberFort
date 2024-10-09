import { Box, Button, Grid, Stack, TextField, Typography, Modal } from '@mui/material';
import { useState } from 'react';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    return (
        <Grid container spacing={2}>
            <Grid item md={6} xs={6}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                        component="img"
                        sx={{
                            width: 50, // Adjust the width as needed
                            height: 'auto', // Maintain aspect ratio
                            borderRadius: 2 // Optional: add some border radius
                        }}
                        alt="Logo"
                        src={logo}
                    />
                    <Typography variant='h5'>
                        FortQuiz
                    </Typography>
                </Stack>
            </Grid>
            <Grid item md={6} xs={6} container justifyContent="flex-end">
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Button sx={{ color: 'black' }}>
                        <Link to="/signin" style={{ textDecoration: 'none', color: 'inherit' }}>Sign In</Link>
                    </Button>
                    <Button variant='contained' sx={{ borderRadius: 0, bgcolor: 'black', color: 'white' }}>
                        <Link to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>Sign up</Link>
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
}

function HeroSection({setOpen}) {
    return (
        <Grid container spacing={{ xs: 15, md: 2 }} sx={{ flexGrow: 1, pb: 15, pl: 20 }}>
            <Grid sx={{ flexGrow: 1 }} item md={6} xs={12} container justifyContent="center" alignItems='center'>
                <Typography variant='h3' align='left'>
                    Create and take quizzes Easily.
                    <br />
                    Very Easy to use
                    <br />
                    Quiz Conducting platform.
                </Typography>
            </Grid>
            <Grid sx={{ flexGrow: 1 }} item md={6} xs={12} container justifyContent="center" alignItems='center'>
                <Stack spacing={2}>
                    <Button variant='contained' sx={{ bgcolor: 'black', color: 'white' }} size="large">
                        <Link to="/create-quiz" style={{ textDecoration: 'none', color: 'inherit' }}>Create Quiz</Link>
                    </Button>
                    <Button variant='outlined' onClick={() => setOpen(true)} sx={{ borderColor: 'black', color: 'black' }} size="large">Take Quiz</Button>
                </Stack>
            </Grid>
        </Grid>
    );
}

function Quiz({ open, setOpen }) {
    const navigate = useNavigate();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    const [values, setValues] = useState({
        id: '',
        name: '',
        quiz_access_code: '',
    });

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const handleSubmit = () => {
        //code to proecss access details &redirect to quiz if all correct 

        console.log(values);

        //
        handleClose();
        navigate(`/quiz/${values.quiz_access_code}`);
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">
                    Access Quiz
                </Typography>
                <TextField
                    label="Id"
                    name="id"
                    value={values.id}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Quiz Access Code"
                    name="quiz_access_code"
                    value={values.quiz_access_code}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                    Submit
                </Button>
            </Box>
        </Modal>
    );
}

const Home = () => {
    const [open, setOpen] = useState(false);

    return (
        <Box
            sx={{
                height: '100vh',
                overflow: 'auto',
                p: 4,
                bgcolor: '#FDFAF0',
                display: 'flex',
                flexDirection: 'column',
                rowGap: 4,
                background: 'linear-gradient(to right, #ff7e5f, #feb47b)' // Gradient background
            }}>
            {/* Header section */}
            <Header />
            {/* Hero section */}
            <HeroSection setOpen={setOpen} />
            {/* Modal for Quiz access */}
            <Quiz open={open} setOpen={setOpen} />
        </Box>
    );
}

export default Home;
