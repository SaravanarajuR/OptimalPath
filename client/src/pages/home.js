import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Popup, Marker, useMap } from "react-leaflet";
import { withStyles } from "@material-ui/styles";
import styles from "../jss/home";
import L from "leaflet";

function MapWithUserLocation(props) {
  const { classes } = props;

  const [userLocation, setUserLocation] = useState(false);
  const [typed, setTyped] = useState("");
  const [refreshRecommendation, setRefreshRecommendation] = useState(false);
  const [userFound, setUserFound] = useState(false);
  const [sourceCoordinates, setSourceCoordinates] = useState(false);
  const [destCoordinates, setDestCoordinates] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(5);
  const [mapKey, setMapKey] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [clickedLocation, setClickedLocation] = useState(false);
  const [toggleRecommendations, setToggleRecommendation] = useState(false);
  const [clickedLocationName, setClickedLocationName] = useState(false);
  const [selectedArea, setSelectedArea] = useState(false);
  const [destTyped, setDestTyped] = useState("");
  const [activeInput, setActiveInput] = useState("");
  const [map, setMap] = useState(false);
  const [boundingBox, setBoundingBox] = useState(null);
  const [center, setCenter] = useState(null);

  const searchRef = useRef();
  const destinationRef = useRef();
  let markerRef = useRef();
  let clickedRef = useRef();

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
      fetchUserLocation();
    }
  }, []);

  useEffect(() => {
    CalculateCenter();
  }, [userLocation, sourceCoordinates, destCoordinates]);

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
    if (evt.target.id === "source") {
      setTyped(evt.target.value);
      setActiveInput("source");
    } else {
      setDestTyped(evt.target.value);
      setActiveInput("destination");
    }
    setTimeout(() => {
      setRefreshRecommendation(true);
    }, 1000);
  };

  const fetchUserLocation = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      const { latitude, longitude } = data;
      setUserLocation({
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      });
      setSourceCoordinates([parseFloat(latitude), parseFloat(longitude)]);
      setUserFound(true);
    } catch (error) {
      console.error("Error getting user location:", error);
    }
  };

  async function handleRecommendationRefresh() {
    let inputValue = activeInput === "source" ? typed : destTyped;
    if (activeInput === "source") {
      inputValue = typed;
    } else if (activeInput === "destination") {
      inputValue = destTyped;
    } else {
      inputValue = "";
    }
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${inputValue}&format=json`
    );
    let res = await response.json();
    let distances = [];
    for (let i = 0; i < res.length; i++) {
      let distance = Math.sqrt(
        Math.pow(userLocation.lat - res[i]["lat"], 2) +
          Math.pow(userLocation.lng - res[i]["lon"], 2)
      );
      distances.push({ index: i, distance: distance });
    }
    distances.sort((a, b) => a.distance - b.distance);
    let sortedRecommendations = [];
    for (let entry of distances) {
      sortedRecommendations.push({
        name: res[entry.index]["display_name"],
        lat: res[entry.index]["lat"],
        id: res[entry.index]["osm_id"],
        lon: res[entry.index]["lon"],
        bounds: res[entry.index]["boundingbox"],
        distance: entry.distance,
      });
    }
    setRecommendations(sortedRecommendations);
    setRefreshRecommendation(false);
  }

  async function handleSubmit() {
    const res = await fetch("http://localhost:9000/getPath", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sourceCoordinates, destCoordinates }),
    });
  }

  function setValue(ele) {
    if (ele === "source") {
      setTyped(clickedLocationName);
      setSourceCoordinates(clickedLocation);
    } else {
      setDestTyped(clickedLocationName);
      setDestCoordinates(clickedLocation);
    }
    setClickedLocation(false);
    setClickedLocationName(false);
    console.log(map.events);
  }

  function handleChoose(evt) {
    const selectedIndex = Number(evt.target.id);
    const selectedRecommendation = recommendations[selectedIndex];
    if (activeInput === "source") {
      setTyped(selectedRecommendation["name"]);
      setSourceCoordinates([
        selectedRecommendation["lat"],
        selectedRecommendation["lon"],
      ]);
    } else if (activeInput === "destination") {
      setDestTyped(selectedRecommendation["name"]);
      setDestCoordinates([
        selectedRecommendation["lat"],
        selectedRecommendation["lon"],
      ]);
    }
    setSelectedArea([
      selectedRecommendation["lat"],
      selectedRecommendation["lon"],
    ]);
    setActiveInput("none");
    setMapKey((prev) => prev + 1);
    setRecommendations([]);
    setTimeout(() => {
      setToggleRecommendation(false);
    }, 100);
    console.log(map);
  }

  const MapEventHandler = () => {
    const map = useMap();
    map.on("click", async (e) => {
      setClickedLocation([e.latlng.lat, e.latlng.lng]);
      let locationName = await getDisplayName(e.latlng.lat, e.latlng.lng);
      setClickedLocationName(locationName);
    });
    return null;
  };

  async function getDisplayName(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data["display_name"];
    } catch (error) {
      console.error("Error fetching display name:", error);
      return null;
    }
  }

  function CalculateCenter() {
    const points = [];
    if (sourceCoordinates) {
      points.push(sourceCoordinates);
    }
    if (destCoordinates) {
      points.push(destCoordinates);
    }

    if (points.length === 0 && userLocation) {
      setCenter([userLocation.lat, userLocation.lng]);
    } else if (points.length === 1) {
      setCenter([points[0][0], points[0][1]]);
    } else if (points.length > 1) {
      let bound = L.latLngBounds(points);
      let centerObj = bound.getCenter();
      setCenter([centerObj.lat, centerObj.lng]);
    } else {
      setCenter(null);
    }
    setMapKey((prev) => prev + 1);
  }

  return (
    <div className={classes.parent}>
      <div className={classes.map}>
        <MapContainer
          center={userLocation ? center : [20.5937, 78.9689]}
          boundsOptions={{ padding: [50, 50] }}
          zoom={zoomLevel}
          whenReady={setMap}
          key={mapKey}
          maxZoom={18}
          style={{ height: "100%", width: "100%", cursor: "default" }}
          zoomControl={false}
        >
          <MapEventHandler />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && (
            <Marker position={sourceCoordinates || userLocation}>
              <Popup
                ref={(r) => {
                  markerRef = r;
                }}
              >
                You are here
              </Popup>
            </Marker>
          )}
          {destCoordinates && (
            <Marker position={destCoordinates}>
              <Popup>{destTyped}</Popup>
            </Marker>
          )}
          {clickedLocation && (
            <Marker position={clickedLocation}>
              <Popup ref={clickedRef}>
                <p>{clickedLocationName}</p>
                <div className={classes.popupDiv}>
                  <button
                    onClick={(evt) => {
                      evt.stopPropagation();
                      setValue("source");
                    }}
                    className={`btn btn-dark ${classes.popupButton}`}
                  >
                    Set as Source
                  </button>
                  <button
                    onClick={(evt) => {
                      evt.stopPropagation();
                      setValue("destination");
                    }}
                    className={`btn btn-dark ${classes.popupButton}`}
                  >
                    Set as Destination
                  </button>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
        <div className={classes.form}>
          <input
            placeholder="from"
            className={classes.input}
            id="source"
            ref={searchRef}
            autoComplete="off"
            value={typed}
            onFocus={() => {
              setToggleRecommendation(true);
              setActiveInput("source");
            }}
            onChange={handleChange}
          />
          <input
            placeholder="to"
            className={classes.input}
            id="destination"
            ref={destinationRef}
            autoComplete="off"
            value={destTyped}
            onFocus={() => {
              setToggleRecommendation(true);
              setActiveInput("destination");
            }}
            onChange={handleChange}
          />
          {toggleRecommendations && activeInput !== "none" ? (
            <div className={classes.recommendations}>
              {recommendations.map((node, index) => {
                return (
                  <div
                    id={index}
                    className={classes.node}
                    onClick={handleChoose}
                    key={index}
                  >
                    <i id={index} className="fa-solid fa-map-location"></i>
                    <p id={index} className={classes.location}>
                      {node["name"]}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <button
        className={`btn btn-dark btn-lg ${classes.submit}`}
        onClick={handleSubmit}
      >
        <i class="fa-solid fa-magnifying-glass"></i> Find Path
      </button>
    </div>
  );
}

export default withStyles(styles)(MapWithUserLocation);
