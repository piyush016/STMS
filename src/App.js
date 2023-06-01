import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavigationBar from "./Navbar/Navbar";
import Home from "./Home/Home";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import ReportProblem from "./ReportProblem/ReportProblem";
import Profile from "./Profile/Profile";
import Maps from "./Maps/Maps";
import { auth } from "./firebase";
import LoaderHome from "./Loader/LoaderHome";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addToHomeScreenOpen, setAddToHomeScreenOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setAddToHomeScreenOpen(true);
      // Store the event for later use
      window.deferredPrompt = event;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setUser(user);
      setLoading(false);
    });

    // Clean up the subscription
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Simulate a loading delay of 5 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    // Clean up the timer
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleAddToHomeScreen = () => {
    setAddToHomeScreenOpen(false);

    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      window.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the installation prompt.");
        } else {
          console.log("User dismissed the installation prompt.");
        }
        // Reset the deferredPrompt
        window.deferredPrompt = null;
      });
    }
  };

  const handleCloseAddToHomeScreen = () => {
    setAddToHomeScreenOpen(false);
  };

  if (loading) {
    return <LoaderHome />;
  }

  return (
    <div className="App">
      <Router>
        <NavigationBar isLoggedIn={isLoggedIn} />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/maps" element={<Maps />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route
            exact
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route
            exact
            path="/report-problem"
            element={<ReportProblem user={user} />}
          />
          <Route
            exact
            path="/profile"
            element={<Profile userId={user?.uid} />}
          />
        </Routes>
        <ToastContainer />
      </Router>

      <Dialog open={addToHomeScreenOpen} onClose={handleCloseAddToHomeScreen}>
        <DialogTitle>Install App</DialogTitle>
        <DialogContent>
          <div>Do you want to add this app to your home screen?</div>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleAddToHomeScreen} color="success">
            Yes
          </Button>
          <Button variant="outlined" onClick={handleCloseAddToHomeScreen} color="error">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
