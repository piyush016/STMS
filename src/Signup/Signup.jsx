import { useState } from "react";
import { Box, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Key from "@mui/icons-material/Key";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import IconTextField from "../IconTextField/IconTextField";

const Signup = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    phoneNumber: "",
    passwordMatchError: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (values.password === values.confirmPassword) {
      handleSignUp();
    } else {
      alertSignupError("Password does not match");
    }
  };

  const handleSignUp = async () => {
 
    const newUser = {
      name: values.name,
      email: values.email,
      phoneNumber: values.phoneNumber,
    };
  
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = res.user;
      // Set the document ID as the user's email
      await setDoc(doc(db, "users", user.uid), newUser);
  
      alertSignupSuccess();
      navigate("/maps");
    } catch (err) {
      alertSignupError(err.message); // Display the specific error message from Firebase
    }
  };
  

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Alert
  const alertSignupSuccess = () => {
    toast.success("Sign up Successful!", {
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

  const alertSignupError = (err) => {
    const errorMessage =
      typeof err === "string" ? err : "Sign up failed. Please try again.";
  
    toast.error(errorMessage, {
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
    <form className="form-signup" onSubmit={handleFormSubmit} style={{backgroundColor: "#F1F0FF"}} >
      <Box
        className="container"
        sx={{
          maxWidth: "600px",
          maxHeight: "100vh",
          mx: "auto",
          py: 4,
          px: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h3">
          <b>Don't have an account?</b>
        </Typography>
        <Typography variant="h4" style={{ marginBottom: 2 }}>
          Sign up with us!
        </Typography>

        <IconTextField
          sx={{ color: "white" }}
          label="Name"
          placeholder="Name"
          type="text"
          iconStart={<PersonIcon sx={{ color: "#fa2185" }} />}
          value={values.name}
          onChange={handleChange("name")}
        />
        <IconTextField
          sx={{ color: "white" }}
          label="Email ID"
          type="email"
          placeholder="Email"
          iconStart={<EmailIcon sx={{ color: "#fa2185" }} />}
          value={values.email}
          onChange={handleChange("email")}
        />
        <IconTextField
          label="Password"
          type={values.showPassword ? "text" : "password"}
          placeholder="Password"
          value={values.password}
          onChange={handleChange("password")}
          iconStart={<Key sx={{ color: "#fa2185" }} />}
          iconEnd={
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {values.showPassword ? (
                <VisibilityOff sx={{ color: "#000000" }} />
              ) : (
                <Visibility sx={{ color: "#000000" }} />
              )}
            </IconButton>
          }
        />
        <IconTextField
          label="Confirm Password"
          type="password"
          value={values.confirmPassword}
          placeholder="Confirm Password"
          onChange={handleChange("confirmPassword")}
          iconStart={<Key sx={{ color: "#fa2185" }} />}
        />
       
        <IconTextField
          sx={{ color: "white" }}
          label="Phone Number"
          placeholder="Phone Number"
          type="text"
          value={values.phoneNumber}
          iconStart={<PhoneIphoneIcon sx={{ color: "#fa2185" }} />}
          onChange={handleChange("phoneNumber")}
        />

        <div className="panel pink">
          <button className="btn2">Sign Up</button>
        </div>
        <div className="panel borderless">
          <Link to="/login">
            <button className="btn2">Already have an account?</button>
          </Link>
        </div>
      </Box>
    </form>
  );
};

export default Signup;
