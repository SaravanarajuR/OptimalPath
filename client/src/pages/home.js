import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { withStyles } from "@material-ui/styles";
import styles from "../jss/home";

// Your MapWithUserLocation component
function MapWithUserLocation(props) {
  const [userLocation, setUserLocation] = useState(null);
  const [userFound, setUserFound] = useState(false);
  const { classes } = props;

  const [zoomLevel, setZoomLevel] = useState(5);
  const [mapKey, setMapKey] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedArea, setSelectedArea] = useState(false);
  const [boundingBox, setBoundingBox] = useState(false);
  const [lat, setLat] = useState(false);
  const [lon, setLon] = useState(false);
  const [name, setName] = useState(false);

  const searchRef = useRef();

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
  }, []);

  function handleChoose(evt) {
    searchRef.current.value = evt.target.textContent;
    setLat(recommendations[Number(evt.target.id)]["lat"]);
    setLon(recommendations[Number(evt.target.id)]["lon"]);
    setBoundingBox(recommendations[Number(evt.target.id)]["bounds"]);
    setName(recommendations[Number(evt.target.id)]["name"]);
    setSelectedArea([
      recommendations[Number(evt.target.id)]["lat"],
      recommendations[Number(evt.target.id)]["lon"],
    ]);
    setMapKey((prev) => prev + 1);
    setRecommendations([]);
  }

  const handleChange = async () => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${searchRef.current.value}&format=json`
    );
    let res = await response.json();
    let recommend = [];
    for (let i of res) {
      recommend.push({
        name: i["display_name"],
        lat: i["lat"],
        lon: i["lon"],
        bounds: i["boundingbox"],
      });
    }
    setRecommendations(recommend);
  };

  useEffect(() => {
    if (userFound && userLocation) {
      setZoomLevel(20);
      setMapKey((prevKey) => prevKey + 1);
    }
  }, [userFound]);

  // Custom map style hook
  const CustomMapStyle = () => {
    const map = useMap();
    // Customize map style here
    return null;
  };

  return (
    <div className={classes.parent}>
      <div className={classes.map}>
        <MapContainer
          center={
            userFound
              ? selectedArea
                ? selectedArea
                : userLocation
              : [20.5937, 78.9629]
          }
          zoom={zoomLevel}
          key={mapKey}
          maxZoom={18}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          {/* Custom map style */}
          <CustomMapStyle />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && (
            <Marker position={selectedArea || userLocation}>
              <Popup>You are here</Popup>
            </Marker>
          )}
        </MapContainer>
        <div className={classes.form}>
          <input
            list="recommendations"
            placeholder="search"
            className={classes.input}
            ref={searchRef}
            onChange={handleChange}
          />
          {recommendations.length > 0 ? (
            <div className={classes.recommendations}>
              {recommendations.map((node, index) => {
                return (
                  <div
                    id={index}
                    className={classes.node}
                    onClick={handleChoose}
                    key={index}
                  >
                    <i className="fa-solid fa-map-location"></i>
                    <p className={classes.location}>{node["name"]}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

// Export the styled component
export default withStyles(styles)(MapWithUserLocation);
