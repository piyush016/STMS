import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db, storage } from "../firebase";
import { setDoc, doc, onSnapshot, deleteDoc } from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import {
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const Profile = ({ userId }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    name: "",
    dob: "",
    phoneNumber: "",
  });
  const [uploading, setUploading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  useEffect(() => {
    // Retrieve user data from Firestore database
    const userDocRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      const data = snapshot.data();
      setUserData(data);
      setFormValues(data || {}); // Set formValues as data or an empty object if data is undefined
      setProfilePicture(data?.profilePicture);
    });
    return () => unsubscribe();
  }, [userId]);

  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setUploading(true);
      const storageRef = ref(storage, `profilePictures/${userId}`);

      // Delete previous profile picture if exists
      if (userData?.profilePicture) {
        const prevProfilePicRef = ref(storage, userData.profilePicture);
        await deleteObject(prevProfilePicRef);
      }

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setProfilePicture(downloadURL);
      const userDocRef = doc(db, "users", userId);
      await setDoc(
        userDocRef,
        { profilePicture: downloadURL },
        { merge: true }
      );
      setUploading(false);
      alertSuccess("Profile Picture Updated Successfully!");
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (profilePicture) {
      // Delete the current profile picture
      const profilePictureRef = ref(storage, profilePicture);
      await deleteObject(profilePictureRef);
      setProfilePicture(null);
      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, { profilePicture: "" }, { merge: true });
      alertSuccess("Profile Picture Deleted Successfully!");
    }
  };

  const handleFormChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editMode) {
      setEditMode(true); // Enable edit mode to allow changes
      return;
    }

    // Update user data in Firestore database
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, formValues);
    setUserData(formValues);
    setEditMode(false);
    alertSuccess("Profile Updated Successfully!");
  };

  const handleEditMode = () => {
    if (!editMode) {
      setFormValues(userData); // Restore original form values when entering edit mode
    }
    setEditMode(!editMode); // Toggle edit mode
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (confirmDelete) {
      try {
        // Delete user document from Firestore
        const userDocRef = doc(db, "users", userId);
        await deleteDoc(userDocRef);

        // Delete user authentication record
        const user = auth.currentUser;
        await user.delete();

        alertSuccess("Account Deleted Successfully!");
        navigate("/");
      } catch (error) {
        console.error("Error deleting account:", error);
        alertError("Failed to delete account. Please try again.");
      }
    }
  };

  const alertSuccess = (msg) => {
    toast.success(`${msg}`, {
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

  const alertError = (msg) => {
    toast.error(`${msg}`, {
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
    <form className="form-profile" onSubmit={handleSubmit} style={{backgroundColor: "#F1F0FF"}}>
      <Box
        className="container"
        sx={{
          position: "relative",
          maxWidth: "700px",
          mx: "auto",
          py: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          
        }}
      >
        <Box autoComplete="off">
          <Typography variant="h3" align="center">
            <b>Profile</b>
          </Typography>

          <div style={{ display: "flex", justifyContent: "center" }}>
            {uploading ? (
              <CircularProgress
                size={"6rem"}
                thickness={2.6}
                color="success"
                sx={{ marginTop: 4, marginBottom: 2 }}
              />
            ) : (
              <Avatar
                alt={userData?.name}
                src={profilePicture}
                sx={{
                  width: 128,
                  height: 128,
                  margin: "1rem 0rem 0.5rem 0rem",

                }}
              />
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
            <label htmlFor="upload-profile-pic">
              <input
                accept="image/*"
                id="upload-profile-pic"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <Button
                variant="contained"
                component="span"
                onClick={handleFileUpload}
                startIcon={<CloudUploadIcon />}
              >
                Upload Profile Picture
              </Button>
            </label>

            {profilePicture && (
              <Button
                variant="contained"
                color="error"
                component="span"
                onClick={handleDeleteProfilePicture}
                startIcon={<DeleteIcon />}
              >
                Remove Profile Picture
              </Button>
            )}
          </div>

          <Box
            sx={{
              mt: 5,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField
              label="Email"
              name="email"
              value={formValues.email}
              onChange={handleFormChange}
              disabled={!editMode}
            />
            <TextField
              label="Name"
              name="name"
              value={formValues.name}
              onChange={handleFormChange}
              disabled={!editMode}
            />
            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              value={formValues.dob}
              onChange={handleFormChange}
              disabled={!editMode}
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              value={formValues.phoneNumber}
              onChange={handleFormChange}
              disabled={!editMode}
            />
           
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "300px",
                mx: "auto",
              }}
            >
              <Button
                variant="contained"
                color={editMode ? "success" : "primary"}
                type="submit"
              >
                {editMode ? "Save" : "Edit Profile"}
              </Button>
              {editMode && (
                <Button
                  variant="outlined"
                  onClick={handleEditMode}
                  sx={{ mt: "0.5rem" }}
                >
                  Cancel
                </Button>
              )}

              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteAccount}
                sx={{ mt: "1rem" }}
              >
                Delete Account
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </form>
  );
};
export default Profile;
