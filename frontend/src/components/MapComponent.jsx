import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,

} from "@vis.gl/react-google-maps";
import cityMarker from "../../src/assets/city-marker.png";
import bonusSiteMarker from "../../src/assets/bonus-site-marker.png";
import ConnectionLine from "./ConnectionLine";
import { useAuth } from "../authentication/AuthContext";
// import { useGame } from "../contexts/GameContext";

const teamColors = {
  "0076f246-bf3c-4900-aadd-87b9a9a37452": "red",
  "79cd421b-81d4-4b00-8b59-da9e7560dc4b": "blue",
  "1446e8a4-350c-4aa1-a997-c05fb87ef102": "green",
};

const colorHex = {
  red: "#FF0000",
  blue: "rgb(0, 85, 255)",
  green: "#22a701",
};

const MapComponent = () => {
  const { getToken } = useAuth();
  // const { refreshData } = useGame();

  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [bonusSites, setBonusSites] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [userTeamId, setUserTeamId] = useState(null);
  const [userLocations, setUserLocations] = useState([]);
  const [usersById, setUsersById] = useState({});

  // 🟢 Shared ref for ALL popups (lines + markers)
  const activeInfoWindowRef = useRef(null);

  const handleMapClick = () => {
    if (activeInfoWindowRef.current) {
      activeInfoWindowRef.current.close();
      activeInfoWindowRef.current = null;
    }
    setSelectedPoi(null);
  };

  const handleMarkerClick = useCallback(
    (poi) => {
      // Close any open InfoWindow first
      if (activeInfoWindowRef.current) {
        activeInfoWindowRef.current.close();
        activeInfoWindowRef.current = null;
      }
      setSelectedPoi((prev) => (prev && prev.id === poi.id ? null : poi));
    },
    [activeInfoWindowRef]
  );

  // Fetch user team info
  useEffect(() => {
    const fetchTeamInfo = async () => {
      const token = await getToken();
      if (!token) return;

      try {
        const res = await fetch("/api/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUserTeamId(data.team_id);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };
    fetchTeamInfo();
  }, [getToken]);

  const userTeamColor = colorHex[teamColors[userTeamId]] || "#000000";

  // Fetch map data
  useEffect(() => {
    const fetchLocations = async () => {
      const token = await getToken();
      if (!token) return;

      try {
        const [citiesRes, routesRes, bonusSitesRes] = await Promise.all([
          fetch("/api/cities/", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/routes/", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/bonus-sites/", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const [citiesData, routesData, bonusSitesData] = await Promise.all([
          citiesRes.json(),
          routesRes.json(),
          bonusSitesRes.json(),
        ]);

        setCities(
          citiesData.map((city) => ({
            id: city.id,
            name: city.name,
            location: { lat: city.latitude, lng: city.longitude },
          }))
        );

        setBonusSites(
          bonusSitesData.map((site) => ({
            id: site.id,
            name: site.site_name,
            location: { lat: site.latitude, lng: site.longitude },
            team_claims: site.team_claims || [],
            site_value: site.site_value || 0,
          }))
        );

        setRoutes(routesData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch map data:", err);
      }
    };

    fetchLocations();
  }, [getToken]);

  useEffect(() => {
  const fetchUserLocations = async () => {
    const token = await getToken();
    if (!token) return;

    try {
      const res = await fetch('/api/user-locations/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user locations');
      const data = await res.json();
      setUserLocations(data);
      console.log("Fetched userLocations:", data);

    } catch (err) {
      console.error('Error fetching user locations:', err);
    }
  };

  fetchUserLocations();
  const interval = setInterval(fetchUserLocations, 30000); // refresh every 30 sec
  return () => clearInterval(interval);
  }, [getToken]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await getToken();
      if (!token) return;

      try {
        const res = await fetch('/api/users/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();

        // Map users by ID for easy lookup
        const mapped = {};
        data.forEach((user) => {
          mapped[user.id] = {
            given_name: user.given_name,
            family_name: user.family_name,
            team_id: user.team_id,
          };
        });
        setUsersById(mapped);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [getToken]);

  if (loading) return <p>Loading map...</p>;

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultZoom={5.3}
        defaultCenter={{ lat: 48.206117, lng: 9.973547 }}
        onClick={handleMapClick}
        mapId="b4d8a034a2c8ed5b"
        streetViewControl={false}
        mapTypeControl={false}
        fullscreenControl={false}
        zoomControl={false}
      >
        {/* City markers */}
        <PoiMarkers
          pois={cities}
          icon={cityMarker}
          minSize={20}
          maxSize={45}
          onMarkerClick={handleMarkerClick}
          activeInfoWindowRef={activeInfoWindowRef}
        />

        {/* Bonus sites */}
        <PoiMarkers
          pois={bonusSites}
          icon={bonusSiteMarker}
          minSize={15}
          maxSize={40}
          onMarkerClick={handleMarkerClick}
          activeInfoWindowRef={activeInfoWindowRef}
        />

        {/* 🟣 User live locations */}
        {userLocations.map((loc) => {
          const userInfo = usersById[loc.user_id];
          const fullName = userInfo
            ? `${userInfo.given_name} ${userInfo.family_name}`
            : loc.user_id;

          return (
            <AdvancedMarker
              key={loc.user_id}
              position={{ lat: loc.latitude, lng: loc.longitude }}
              clickable
              onClick={() =>
                setSelectedPoi({
                  id: loc.user_id,
                  location: { lat: loc.latitude, lng: loc.longitude },
                  type: "user-location",
                  name: fullName,
                })
              }
            >
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  backgroundColor: "#FF1493",
                  border: "2px solid white",
                  boxShadow: "0 0 6px rgba(255, 20, 147, 0.8)",
                  transform: "translate(0%, 50%)",
                }}
                title={`👥 ${fullName}`}
              />
            </AdvancedMarker>
          );
        })}

        {/* Connection lines */}
        {routes.map((route) => {
          const start = cities.find((c) => c.id === route.start_city_id);
          const end = cities.find((c) => c.id === route.end_city_id);
          if (!start || !end) return null;
          return (
            <ConnectionLine
              key={route.id}
              from={start.location}
              to={end.location}
              routeInfo={route}
              userTeamId={userTeamId}
              userTeamColor={userTeamColor}
              activeInfoWindowRef={activeInfoWindowRef} // 🟢 shared popup ref
            />
          );
        })}

        {/* Marker popup (only one shown at a time) */}
        {selectedPoi && (
          <InfoWindow
            position={selectedPoi.location}
            onCloseClick={() => setSelectedPoi(null)}
          >
            <div style={{ padding: "6px 10px", fontFamily: "Poppins, sans-serif" }}>
              {selectedPoi.type === "user-location" ? (
                <>
                  <div style={{ fontWeight: 600, fontSize: "15px" }}>
                    👥 {selectedPoi.name}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: "bold" }}>{selectedPoi.name}</div>
                  {bonusSites.some((s) => s.id === selectedPoi.id) && userTeamId && (
                    <button
                      style={{
                        marginTop: "5px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        border: "1px solid #333",
                        backgroundColor: "#f0f0f0",
                      }}
                      onClick={() => alert("Claim logic here")}
                    >
                      Claim / Unclaim
                    </button>
                  )}
                </>
              )}
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
};

// --- Marker Helper Component ---
const PoiMarkers = ({ pois, icon, minSize, onMarkerClick }) => {
  // const map = useMap();
  const handleClick = (poi) => onMarkerClick(poi);

  return (
    <>
      {pois.map((poi) => (
        <AdvancedMarker
          key={poi.id}
          position={poi.location}
          clickable
          onClick={() => handleClick(poi)}
        >
          <img
            src={icon}
            alt="poi-marker"
            style={{
              width: `${minSize}px`,
              height: `${minSize}px`,
              objectFit: "contain",
              transform: "translate(0%, 50%)",
            }}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default MapComponent;
