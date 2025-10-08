// MapComponent.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import cityMarker from "../../src/assets/city-marker.png";
import bonusSiteMarker from "../../src/assets/bonus-site-marker.png";
import ConnectionLine from "./ConnectionLine";
import { useAuth } from "../authentication/AuthContext";
import { useGame } from "../contexts/GameContext";

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

// Custom hook to size markers dynamically based on zoom level
const useZoomSize = (minSize, maxSize, minZoom = 5, maxZoom = 10) => {
  const map = useMap();
  const [currentZoom, setCurrentZoom] = useState(map ? map.getZoom() : minZoom);

  useEffect(() => {
    if (!map) return;
    const listener = map.addListener("zoom_changed", () =>
      setCurrentZoom(map.getZoom())
    );
    return () => {
      if (listener && typeof listener.remove === "function") listener.remove();
    };
  }, [map]);

  const zoomFactor = Math.min(
    1,
    Math.max(0, (currentZoom - minZoom) / (maxZoom - minZoom))
  );
  return minSize + (maxSize - minSize) * zoomFactor;
};

const MapComponent = () => {
  const { getToken } = useAuth();
  const { refreshData } = useGame();

  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [bonusSites, setBonusSites] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [userTeamId, setUserTeamId] = useState(null);

  const handleMapClick = () => setSelectedPoi(null);
  const handleMarkerClick = useCallback((poi) => {
    setSelectedPoi((prev) => (prev && prev.id === poi.id ? null : poi));
  }, []);

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

  // Compute the user’s team color once we have the team ID
  const userTeamColor =
    colorHex[teamColors[userTeamId]] || "#000000"; // fallback black

  // Fetch all map data
  useEffect(() => {
    const fetchLocations = async () => {
      const token = await getToken();
      if (!token) return;

      try {
        const [citiesRes, routesRes, bonusSitesRes] = await Promise.all([
          fetch("/api/cities/", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/routes/", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/bonus-sites/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
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

  if (loading) return <p>Loading map...</p>;

  const handleClaim = async (siteId) => {
    if (!userTeamId) {
      alert("No team ID found!");
      return;
    }

    const token = await getToken();
    if (!token) return;

    const site = bonusSites.find((s) => s.id === siteId);
    const alreadyClaimed = site.team_claims?.some(
      (claim) => claim.team_id === userTeamId
    );

    try {
      const url = `/api/bonus-sites/${siteId}/${alreadyClaimed ? "unclaim" : "claim"}/`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ team_id: userTeamId }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update claim");
      }

      // Update local state
      setBonusSites((prev) =>
        prev.map((s) =>
          s.id === siteId
            ? {
                ...s,
                team_claims: alreadyClaimed
                  ? s.team_claims.filter((c) => c.team_id !== userTeamId)
                  : [...s.team_claims, { team_id: userTeamId }],
              }
            : s
        )
      );

      setSelectedPoi((prev) =>
        prev && prev.id === siteId
          ? {
              ...prev,
              team_claims: alreadyClaimed
                ? prev.team_claims.filter((c) => c.team_id !== userTeamId)
                : [...prev.team_claims, { team_id: userTeamId }],
            }
          : prev
      );

      refreshData();
    } catch (err) {
      console.error("Failed to update claim:", err);
      alert("Failed to update bonus site");
    }
  };

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultZoom={5.3}
        defaultCenter={{ lat: 48.206117, lng: 9.973547 }}
        mapId="b4d8a034a2c8ed5b"
        streetViewControl={false}
        mapTypeControl={false}
        fullscreenControl={false}
        onClick={handleMapClick}
      >
        <PoiMarkers
          pois={cities}
          icon={cityMarker}
          minSize={20}
          maxSize={45}
          onMarkerClick={handleMarkerClick}
        />
        <PoiMarkers
          pois={bonusSites}
          icon={bonusSiteMarker}
          minSize={15}
          maxSize={40}
          onMarkerClick={handleMarkerClick}
        />

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
            />
          );
        })}

        {selectedPoi && (
          <InfoWindow
            position={selectedPoi.location}
            onCloseClick={() => setSelectedPoi(null)}
          >
            <div style={{ padding: "5px", fontWeight: "bold" }}>
              <div>{selectedPoi.name}</div>
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
                  onClick={() => handleClaim(selectedPoi.id)}
                >
                  {selectedPoi.team_claims?.some(
                    (c) => c.team_id === userTeamId
                  )
                    ? "Unclaim"
                    : "Claim"}
                </button>
              )}
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
};

// Helper component for markers
const PoiMarkers = ({ pois, icon, minSize, maxSize, onMarkerClick }) => {
  const map = useMap();
  const calculatedSize = useZoomSize(minSize, maxSize);
  const imageSize = `${calculatedSize}px`;

  const handleClick = useCallback(
    (poi, ev) => {
      if (!map) return;
      onMarkerClick(poi);
      if (ev.latLng) map.panTo(ev.latLng);
    },
    [map, onMarkerClick]
  );

  return (
    <>
      {pois.map((poi) => (
        <AdvancedMarker
          key={poi.id}
          position={poi.location}
          clickable
          onClick={(ev) => handleClick(poi, ev)}
        >
          <img
            src={icon}
            alt="poi-marker"
            style={{
              width: imageSize,
              height: imageSize,
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
