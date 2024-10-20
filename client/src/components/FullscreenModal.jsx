// components/FullscreenModal.js
import { Box, Button, Typography, Modal } from '@mui/material';

function FullscreenModal({ isOpen, enterFullscreen }) {
    return (
        <Modal
            open={isOpen}
            onClose={() => { }}
            aria-labelledby="fullscreen-modal-title"
            aria-describedby="fullscreen-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    textAlign: 'center'
                }}
            >
                <Typography id="fullscreen-modal-title" variant="h6" component="h2">
                    Fullscreen Required
                </Typography>
                <Typography id="fullscreen-modal-description" sx={{ mt: 2 }}>
                    To continue with the quiz, please enter fullscreen mode.
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={enterFullscreen}>
                    Enter Fullscreen
                </Button>
            </Box>
        </Modal>
    );
}

export default FullscreenModal;
