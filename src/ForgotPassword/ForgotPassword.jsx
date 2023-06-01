import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import IconTextField from "../IconTextField/IconTextField";

import { auth } from "../firebase"; // Assuming you've exported auth from your firebase.js file
import { sendPasswordResetEmail } from "firebase/auth";

import { toast } from "react-toastify";
import AccountCircle from "@mui/icons-material/AccountCircle";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alertSuccess();
        setResetEmailSent(true);
      })
      .catch((error) => {
        alertError(error);
        console.error("Error sending password reset email:", error);
      });
  };

  const alertSuccess = () => {
    toast.success("Reset Password mail sent successfully!", {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const alertError = (error) => {
    toast.error(`${error}`, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  return (
    <Box
      className="container"
      sx={{
        maxWidth: "500px",
        mx: "auto",
        my: 7,
        py: 2,
        px: 2,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {resetEmailSent ? (
        <Typography variant="h3" align="center" >
          Password reset email sent. Please check your email.
        </Typography>
      ) : (
        <>
          <Typography variant="h3">
            <b>Forgot Password?</b>
          </Typography>
          <Typography variant="h4" style={{ marginBottom: 20 }}>
            No worries!
          </Typography>
          <IconTextField
            label="Email"
            type="email"
            variant="outlined"
            iconStart={<AccountCircle sx={{ color: "#fa2185" }} />}
            value={email}
            onChange={handleEmailChange}
          />

          <div className="panel pink">
            <button className="btn2" onClick={handleResetPassword}>
              Reset Button
            </button>
          </div>
        </>
      )}
    </Box>
  );
};

export default ForgotPassword;
