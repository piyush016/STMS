import { useEffect, useRef } from "react";

function Map({ origin, destination }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
    });

    directionsRenderer.setMap(map);

    if (origin && destination) {
      const request = {
        origin,
        destination,
        travelMode: "DRIVING",
      };

      directionsService.route(request, (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
        }
      });
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting user's location:", error);
          // Set default center for India
          map.setCenter({ lat: 20.5937, lng: 78.9629 });
        }
      );
    } else {
      // Set default center for India if geolocation is not supported
      map.setCenter({ lat: 20.5937, lng: 78.9629 });
    }
  }, [origin, destination]);

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
}

export default Map;
