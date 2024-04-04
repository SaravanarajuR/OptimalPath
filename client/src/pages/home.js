import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { withStyles } from "@material-ui/styles";
import styles from "../jss/home";

function MapWithUserLocation(props) {
  const { classes } = props;

  const [userLocation, setUserLocation] = useState(null);
  const [typed, setTyped] = useState("");
  const [refreshRecommendation, setRefreshRecommendation] = useState(false);
  const [userFound, setUserFound] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(5);
  const [mapKey, setMapKey] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [toggleRecommendations, setToggleRecommendation] = useState(true);
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

  useEffect(() => {
    handleRecommendationRefresh();
  }, [refreshRecommendation]);

  useEffect(() => {
    if (userFound && userLocation) {
      setZoomLevel(20);
      setMapKey((prevKey) => prevKey + 1);
    }
  }, [userFound, userLocation]);

  const handleChange = async (evt) => {
    setTyped(evt.target.value);
    setTimeout(() => {
      setRefreshRecommendation(true);
    }, 1000);
  };

  async function handleRecommendationRefresh() {
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
    setRefreshRecommendation(false);
  }

  function handleChoose(evt) {
    const selectedIndex = Number(evt.target.id);
    const selectedRecommendation = recommendations[selectedIndex];
    setTyped(selectedRecommendation["name"]);
    setLat(selectedRecommendation["lat"]);
    setLon(selectedRecommendation["lon"]);
    setBoundingBox(selectedRecommendation["bounds"]);
    setName(selectedRecommendation["name"]);
    setSelectedArea([
      selectedRecommendation["lat"],
      selectedRecommendation["lon"],
    ]);
    setMapKey((prev) => prev + 1);
    setRecommendations([]);
    setTimeout(() => {
      setToggleRecommendation(false);
    }, 100);
  }

  const CustomMapStyle = () => {
    const map = useMap();
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
            placeholder="search"
            className={classes.input}
            ref={searchRef}
            value={typed}
            onFocus={() => {
              setToggleRecommendation(true);
            }}
            onChange={handleChange}
          />
          <div className={classes.selectedArea}></div>
          {toggleRecommendations ? (
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

export default withStyles(styles)(MapWithUserLocation);
