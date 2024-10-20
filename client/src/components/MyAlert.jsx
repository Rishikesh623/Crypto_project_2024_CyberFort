import { Alert, AlertTitle } from '@mui/material';

const MyAlert = ({ alert }) => {

    return <>
        <Alert severity={alert.type} sx={{ position: 'fixed', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
            <AlertTitle>{alert.title}</AlertTitle>
            {alert.message}
        </Alert>

    </>

};


export default MyAlert;