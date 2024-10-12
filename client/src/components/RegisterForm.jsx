import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { motion } from "framer-motion";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {useUserContext} from '../contexts/UserContext';

let easing = [0.6, -0.05, 0.01, 0.99];
const animate = {
    opacity: 1,
    y: 0,
    transition: {
        duration: 0.6,
        ease: easing,
        delay: 0.16,
    },
};

const RegisterForm = () => {
    const navigate = useNavigate();
    const {register} = useUserContext();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username:"",
        email: "",
        password: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log(formData);

        setTimeout(() => {
            register(formData.username,formData.email,formData.password);
            // console.log("Submitted form data: ", formData);
            setIsSubmitting(false);
            navigate('../dashboard');
        }, 2000);
    };

    return (
        <form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box component={motion.div} animate={{
                                                    transition: {
                                                        staggerChildren: 0.55,
                                                    },}}>
                <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                    component={motion.div} initial={{ opacity: 0, y: 40 }} animate={animate}>
                    
                    <TextField
                        fullWidth
                        autoComplete="username"
                        type="name"
                        label="Name"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}

                    />

                    <TextField
                        fullWidth
                        autoComplete="email"
                        type="email"
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}

                    />

                    <TextField
                        fullWidth
                        autoComplete="current-password"
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? (
                                            <VisibilityIcon />
                                        ) : (
                                            <VisibilityOffIcon />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={animate}
                    sx={{ mt: 3 }} 
                >
                    <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                    >
                        {isSubmitting ? "loading..." : "Register"}
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default RegisterForm;
