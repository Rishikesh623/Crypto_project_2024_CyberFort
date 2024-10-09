// import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import logo from '../assets/logo.png';

const Logo = () => {
  return (
    <Box>
      {/* <Link to="/"> */}
        <Box component="img" sx={{
                            width: 50, // Adjust the width as needed
                            height: 'auto', // Maintain aspect ratio
                            borderRadius: 2 // Optional: add some border radius
                        }} src={logo} alt="logo" />
        
      {/* </Link> */}
    </Box>
  );
};

export default Logo;