import { useEffect, useRef } from "react";

function Map({ apiKey, origin, destination }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 12.9716, lng: 77.5946 },
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
  }, [apiKey, origin, destination]);

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
}

export default Map;
