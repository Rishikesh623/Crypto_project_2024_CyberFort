import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Container, Paper, Grid } from '@mui/material';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: 'John Doe',
        id: '123456',
        email: 'johndoe@example.com',
        about: 'This is a brief bio about me.',
        extraField: '' // Optional field
    });

    const handleEdit = () => setIsEditing(!isEditing);
    const handleChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
    const handleSave = () => setIsEditing(false); // Handle saving the changes

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4, backgroundColor: '#fafafa', borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Profile
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            name="name"
                            value={profileData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            InputProps={{ style: { backgroundColor: '#fff' } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="ID"
                            variant="outlined"
                            fullWidth
                            name="id"
                            value={profileData.id}
                            onChange={handleChange}
                            disabled
                            InputProps={{ style: { backgroundColor: '#fff' } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            name="email"
                            value={profileData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            InputProps={{ style: { backgroundColor: '#fff' } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2, bgcolor: '#2196f3', color: 'white' }}
                            onClick={() => alert('Password change functionality not yet implemented')}
                        >
                            Change Password
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="About"
                            variant="outlined"
                            fullWidth
                            name="about"
                            multiline
                            rows={4}
                            value={profileData.about}
                            onChange={handleChange}
                            disabled={!isEditing}
                            InputProps={{ style: { backgroundColor: '#fff' } }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Optional Field"
                            variant="outlined"
                            fullWidth
                            name="extraField"
                            value={profileData.extraField}
                            onChange={handleChange}
                            disabled={!isEditing}
                            InputProps={{ style: { backgroundColor: '#fff' } }}
                        />
                    </Grid>
                </Grid>
                <Box mt={4} display="flex" justifyContent="space-between">
                    {isEditing ? (
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Save Changes
                        </Button>
                    ) : (
                        <Button variant="contained" color="secondary" onClick={handleEdit}>
                            Edit Profile
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile;
