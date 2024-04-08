import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  useMapEvents,
  Marker,
} from "react-leaflet";
import { withStyles } from "@material-ui/styles";
import styles from "../jss/home";

function MapWithUserLocation(props) {
  const { classes } = props;

  const [userLocation, setUserLocation] = useState(null);
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
  const [map, setMap] = useState();

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
      setActiveInput("source"); // Set active input as source
    } else {
      setDestTyped(evt.target.value);
      setActiveInput("destination"); // Set active input as destination
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
    console.log(inputValue);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${inputValue}&format=json`
    );
    let res = await response.json();
    console.log(res);
    let distances = [];

    // Calculate distances and associate with recommendations
    for (let i = 0; i < res.length; i++) {
      let distance = Math.sqrt(
        Math.pow(userLocation.lat - res[i]["lat"], 2) +
          Math.pow(userLocation.lng - res[i]["lon"], 2)
      );
      distances.push({ index: i, distance: distance });
    }

    // Sort recommendations based on distances
    distances.sort((a, b) => a.distance - b.distance);

    // Reorder recommendations based on sorted distances
    let sortedRecommendations = [];
    for (let entry of distances) {
      sortedRecommendations.push({
        name: res[entry.index]["display_name"],
        lat: res[entry.index]["lat"],
        id: res[entry.index]["osm_id"],
        lon: res[entry.index]["lon"],
        bounds: res[entry.index]["boundingbox"],
        distance: entry.distance, // Optional: include distance in recommendation object
      });
    }

    // Set sorted recommendations and update state
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
  }

  const MapEventHandler = () => {
    const map = useMapEvents({
      click: async (e) => {
        setClickedLocation([e.latlng.lat, e.latlng.lng]);
        let locationName = await getDisplayName(e.latlng.lat, e.latlng.lng);
        setClickedLocationName(locationName);
      },
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

  const calculateBoundingBox = (markers) => {
    if (markers.length === 0) return null;

    let latitudes = markers.map((marker) => marker.lat);
    let longitudes = markers.map((marker) => marker.lng);

    let minLat = Math.min(...latitudes);
    let maxLat = Math.max(...latitudes);
    let minLng = Math.min(...longitudes);
    let maxLng = Math.max(...longitudes);

    return [
      [(minLat + maxLat) / 2, (minLng + maxLng) / 2],
      [minLat, minLng],
      [maxLat, maxLng],
    ];
  };

  const allMarkers = [];
  if (sourceCoordinates)
    allMarkers.push({ lat: sourceCoordinates[0], lng: sourceCoordinates[1] });
  if (destCoordinates)
    allMarkers.push({ lat: destCoordinates[0], lng: destCoordinates[1] });
  if (clickedLocation)
    allMarkers.push({ lat: clickedLocation[0], lng: clickedLocation[1] });

  // Calculate bounding box
  const boundingBox = calculateBoundingBox(allMarkers);

  return (
    <div className={classes.parent}>
      <div className={classes.map}>
        <MapContainer
          whenReady={setMap}
          center={boundingBox ? boundingBox[0] : userLocation}
          bounds={boundingBox ? boundingBox.slice(1) : null}
          zoom={zoomLevel}
          key={mapKey}
          maxZoom={18}
          style={{ height: "100%", width: "100%", cursor: "default" }}
          zoomControl={false}
        >
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
                    onClick={() => {
                      setValue("source");
                    }}
                    className={`btn btn-dark ${classes.popupButton}`}
                  >
                    Set as Source
                  </button>
                  <button
                    onClick={() => {
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
              setActiveInput("source"); // Set active input as source
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
              setActiveInput("destination"); // Set active input as destination
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
