import React, { useState, useEffect } from "react";
import LocationSharingForm from "./LocationSharingForm";
import MapComponent from "./MapComponent";
import { useAuth } from "../authentication/AuthContext";

const Dashboard = () => {
  const { getToken } = useAuth();
  const [trackedLocations, setTrackedLocations] = useState([]);

  // Fetch active tracked locations from API
  const fetchTrackedLocations = async () => {
    const token = await getToken();
    if (!token) return;

    try {
      const res = await fetch("/api/user-locations/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const activeLocations = data.filter((loc) => loc.is_active);
      setTrackedLocations(activeLocations);
    } catch (err) {
      console.error("Failed to fetch tracked locations:", err);
    }
  };

  // Poll tracked locations every 30s
  useEffect(() => {
    fetchTrackedLocations();
    const interval = setInterval(fetchTrackedLocations, 30000);
    return () => clearInterval(interval);
  }, [getToken]);

  return (
    <div>
      <LocationSharingForm onTracked={fetchTrackedLocations} />
      <MapComponent trackedLocations={trackedLocations} />
    </div>
  );
};

export default Dashboard;
