import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { withStyles } from "@material-ui/styles";
import styles from "../jss/home";

function MapWithUserLocation(props) {
  const [userLocation, setUserLocation] = useState(null);
  const [userFound, setUserFound] = useState(false);
  const { classes } = props;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setUserFound(true);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
    }
  }, []); // Empty dependency array ensures this effect runs only once

  // Calculate zoom level based on userFound state and distance
  let zoomLevel = 5; // Default zoom level
  if (userFound) {
    const defaultZoom = 15; // A reasonable default zoom level
    const distance = Math.max(
      Math.abs(userLocation.lat - 20.5937),
      Math.abs(userLocation.lng - 78.9629)
    ); // Calculate distance between user location and default center
    zoomLevel = Math.floor(defaultZoom - Math.log2(distance));
  }

  return (
    <div className={classes.parent}>
      <div className={classes.map}>
        <MapContainer
          center={userFound ? userLocation : [20.5937, 78.9629]}
          zoom={zoomLevel}
          maxZoom={18} // set a reasonable maxZoom value
          style={{ height: "100%", width: "100%" }} // Ensure MapContainer takes up full width and height of its parent
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>You are here</Popup>
            </Marker>
          )}
        </MapContainer>
        <div className={classes.form}></div>
      </div>
    </div>
  );
}

export default withStyles(styles)(MapWithUserLocation);
