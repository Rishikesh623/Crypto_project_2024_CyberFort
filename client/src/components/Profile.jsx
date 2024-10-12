import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Container, Paper, Grid, Modal } from '@mui/material';
import { useUserContext } from '../contexts/UserContext';

// ChangePasswordModal Component
const ChangePasswordModal = ({ onClose, onChangePassword }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        onChangePassword(currentPassword, newPassword);
    };

    return (
        <Modal open onClose={onClose}>
            <Box sx={{ ...modalStyles }}>
                <Typography variant="h6" gutterBottom>Change Password</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Current Password"
                        type="password"
                        fullWidth
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        margin="normal"
                    />
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button type="submit" variant="contained" color="primary">Change Password</Button>
                        <Button onClick={onClose} variant="outlined" color="secondary">Cancel</Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

const Profile = () => {
    const { user, editUserProfile, changeUserPassword } = useUserContext();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData(user);
        }
    }, [user]);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSave = () => {
        editUserProfile(profileData);
        setIsEditing(false);
    };

    const handleOpenChangePasswordModal = () => {
        setIsChangePasswordModalOpen(true);
    };

    const handleCloseChangePasswordModal = () => {
        setIsChangePasswordModalOpen(false);
    };

    const handleChangePassword = async (currentPassword, newPassword) => {
        const response = await changeUserPassword(currentPassword, newPassword);
        if (!response.error) {
            alert('Password changed successfully');
            handleCloseChangePasswordModal();
        } else {
            alert('Error: ' + response.message);
        }
    };

    if (!profileData) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4, backgroundColor: '#fafafa', borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom>Profile</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            name="name"
                            value={profileData.name || ''}
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
                            value={profileData.id || ''}
                            disabled
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ style: { backgroundColor: '#fff' } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            name="email"
                            value={profileData.email || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ style: { backgroundColor: '#fff' } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2, bgcolor: '#2196f3', color: 'white' }}
                            onClick={handleOpenChangePasswordModal}
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
                            value={profileData.about || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Optional Field"
                            variant="outlined"
                            fullWidth
                            name="extraField"
                            value={profileData.extraField || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ style: { backgroundColor: '#fff' } }}
                        />
                    </Grid>
                </Grid>
                <Box mt={4} display="flex" justifyContent="space-between">
                    {isEditing ? (
                        <Button variant="contained" color="primary" onClick={handleSave}>Save Changes</Button>
                    ) : (
                        <Button variant="contained" color="secondary" onClick={handleEdit}>Edit Profile</Button>
                    )}
                </Box>
            </Paper>

            {isChangePasswordModalOpen && (
                <ChangePasswordModal
                    onClose={handleCloseChangePasswordModal}
                    onChangePassword={handleChangePassword}
                />
            )}
        </Container>
    );
};

export default Profile;

// Modal Styles for Material UI
const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
