import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png";
import { toast } from "react-toastify";
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { CgProfile } from "react-icons/cg";
import { MdReportProblem } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { TbMapSearch } from "react-icons/tb";

export default function NavigationBar({ isLoggedIn, userName }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const avatarButtonRef = useRef(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    alertSuccess("Logged Out Successfully!");
    auth.signOut();
    navigate("/"); // Redirect to the homepage
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

  return (
    <AppBar position="static" style={{ backgroundColor: "#4d1f5f" }}>
      <Toolbar>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <img
            src={logo}
            alt="logo"
            style={{ borderRadius: "100%", height: "75px", margin: "0.5rem" }}
          />
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        {isLoggedIn ? (
          <div>
            <Button
              ref={avatarButtonRef}
              onClick={handleMenuOpen}
              color="inherit"
              startIcon={<Avatar />}
            >
              {userName}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={handleMenuClose}
                component={Link}
                to="/maps"
              >
                <TbMapSearch /> Find Direction
              </MenuItem>

              <MenuItem
                onClick={handleMenuClose}
                component={Link}
                to="/profile"
              >
                <CgProfile /> Profile
              </MenuItem>
              <MenuItem
                onClick={handleMenuClose}
                component={Link}
                to="/report-problem"
              >
                <MdReportProblem /> Report Problem
              </MenuItem>
              <MenuItem onClick={handleLogoutClick}>
                <BiLogOut /> Logout
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <Button
            component={Link}
            to="/login"
            color="inherit"
            sx={{
              backgroundImage:
                "linear-gradient(to right, rgba(255, 87, 34, 1) 0%, rgba(255, 193, 7, 1) 100%)",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundImage:
                  "linear-gradient(to right, rgba(255, 193, 7, 1) 0%, rgba(255, 87, 34, 1) 100%)",
              },
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
