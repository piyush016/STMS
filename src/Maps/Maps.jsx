import React, { useState, useEffect, useCallback } from "react";
import useSound from "use-sound";
import alertSound from "../assets/siren.mp3";
import io from "socket.io-client";
import Map from "./Map";
import Form from "react-bootstrap/Form";
import {
  Checkbox,
  Stack,
  Button,
  Typography,
  Box,
  Drawer,
  IconButton,
  FormControlLabel,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import LoaderRoute from "../Loader/LoaderRoute";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import IconTextField from "../IconTextField/IconTextField";
import { toast } from "react-toastify";

const Maps = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [directions, setDirections] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [playAlertSound] = useSound(alertSound);

  useEffect(() => {
    const newSocket = io("https://stms-server.onrender.com/");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user's location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
    }
  }, []);

  const handleOriginChange = (e) => {
    setOrigin(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    handleDrawerToggle();
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const response = await fetch(
        `https://stms-server.onrender.com/directions?origin=${origin}&destination=${destination}&isEmergency=${isEmergency}`
      );
      const data = await response.json();
      console.log(data);
      const routes = data.routes;
      setDirections(routes);
      if (isEmergency) {
        playAlertSound();
        socket.emit("emergency", { origin, destination });
        console.log(`Emergency: ${origin}, ${destination}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNavigation = () => {
    if (mapInstance && directions) {
      mapInstance.setDirections(null);
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      directionsRenderer.setMap(mapInstance);
      directionsRenderer.setDirections(directions);
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    if (isLoading) {
      const loaderTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);

      return () => clearTimeout(loaderTimeout);
    }
  }, [isLoading]);

  const showEmergencyAlert = useCallback(
    (origin, destination) => {
      if (!currentAlert) {
        setCurrentAlert({ origin, destination });

        toast.error(
          <div>
            <Typography variant="h6">Emergency Alert</Typography>
            <Typography variant="body1">
              Emergency vehicle approaching on route from <b>{origin}</b> to{" "}
              <b>{destination}</b>
            </Typography>
          </div>,
          {
            position: "top-center",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            onClose: () => setCurrentAlert(null),
          }
        );
      }
    },
    [currentAlert]
  );

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoute", { origin, destination });

      const handleEmergencyAlert = (data) => {
        showEmergencyAlert(data.origin, data.destination);
      };

      socket.on("emergencyAlert", handleEmergencyAlert);

      return () => {
        socket.off("emergencyAlert", handleEmergencyAlert);
      };
    }
  }, [socket, origin, destination, showEmergencyAlert]);

  return (
    <div>
      <Box sx={{ display: "flex", height: "87vh" }}>
        <Box sx={{ flex: "1 1 0%", position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
            }}
          >
            {isLoading ? (
              <LoaderRoute />
            ) : (
              <>
                <Map
                  directions={directions}
                  origin={origin}
                  destination={destination}
                  onMapLoad={(map) => setMapInstance(map)}
                />

                <Box
                  sx={{
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 999,
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleStartNavigation}
                  >
                    Start Navigation
                  </Button>
                </Box>
              </>
            )}
          </Box>

          <ChevronRightIcon
            onClick={handleDrawerToggle}
            sx={{
              position: "absolute",
              top: "50%",
              left: "10px",
              zIndex: 999,
              backgroundColor: "#000000",
              color: "#ffffff",
              borderRadius: "100%",
              fontSize: "2.5rem",
              display: drawerOpen ? "none" : "block",
              cursor: "pointer",
            }}
          />
        </Box>

        <Drawer
          variant="persistent"
          anchor="left"
          open={drawerOpen}
          sx={{
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 350,
              height: "100vh",
              backgroundColor: "#f1f0ff",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton onClick={handleDrawerToggle}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Form onSubmit={handleSubmit}>
              <Box sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Directions
                  </Typography>
                  <IconTextField
                    label="Origin"
                    placeholder="Enter origin"
                    value={origin}
                    onChange={handleOriginChange}
                    required
                  />
                  <IconTextField
                    label="Destination"
                    placeholder="Enter destination"
                    value={destination}
                    onChange={handleDestinationChange}
                    required
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isEmergency}
                        onChange={(e) => setIsEmergency(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Emergency"
                  />
                  <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    disabled={isLoading}
                  >
                    Get Directions
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setOrigin("");
                      setDestination("");
                    }}
                    disabled={isLoading}
                  >
                    Clear
                  </Button>
                </Stack>
              </Box>
            </Form>
          </Box>
        </Drawer>
      </Box>

      <IconButton
        onClick={() => {
          if (mapInstance && userLocation) {
            mapInstance.setCenter(userLocation);
          }
        }}
        sx={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          backgroundColor: "#ffffff",
        }}
      >
        <MyLocationIcon />
      </IconButton>
    </div>
  );
};

export default Maps;
