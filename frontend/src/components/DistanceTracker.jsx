import React, { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext';
import { useGame } from '../contexts/GameContext';
import './DistanceTracker.css';

const DistanceTracker = ({ teamId, teamName, color }) => {
  const { getToken } = useAuth();
  const { updateCount } = useGame();
  const [totalDistance, setTotalDistance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalDistance = async () => {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      try {
        // Fetch the computed total distance for this team
        const res = await fetch(`/api/claimed-distance/${teamId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error('Failed to fetch claimed distance:', res.statusText);
          setTotalDistance(0);
          return;
        }

        const data = await res.json();

        // The API response model is schemas.ClaimedDistance
        // which includes: team_id, team_name, claimed_distance
        setTotalDistance(data.claimed_distance);
      } catch (error) {
        console.error('Error fetching claimed distance:', error);
        setTotalDistance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalDistance();
  }, [getToken, teamId, updateCount]);

  return (
    <div className="distanceContainer" style={{ backgroundColor: color }}>
      <div className="teamName">{teamName}</div>
      <div className="distance">
        {loading ? '...' : totalDistance}
      </div>
      <div className="km">km</div>
    </div>
  );
};

export default DistanceTracker;
