import { Alert, AlertTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const MyAlert = ({ alert,setShowCustomAlert }) => {

    return (
        <Alert 
            severity={alert.type} 
            sx={{ position: 'fixed', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}
            action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setShowCustomAlert(null);
                    }}
                >
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            }
        >
            <AlertTitle>{alert.title}</AlertTitle>
            {alert.message}
        </Alert>
    );

};

export default MyAlert;
