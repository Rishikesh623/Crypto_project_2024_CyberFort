import { Stack, IconButton } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import XIcon from '@mui/icons-material/X';

const SocialAuth = () => {
  return (
    <>
      <Stack direction="row" spacing={2}>
        <IconButton
          sx={{
            border: "2px solid #ccc",
            borderRadius: "5px",
            padding: "0.5675rem",
            flex: 1,
          }}
        >
          <GoogleIcon sx={{ color: "#DF3E30" }} />
        </IconButton>
        <IconButton
          sx={{
            border: "2px solid #ccc",
            borderRadius: "5px",
            padding: "0.5675rem",
            flex: 1,
          }}
        >
          <XIcon sx={{ color: "#1C9CEA" }} />
        </IconButton>
      </Stack>
    </>
  );
};

export default SocialAuth;