import React, { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext';
import { useGame } from '../contexts/GameContext';
import './DistanceTracker.css';

const DistanceTracker = ({ teamId, color }) => {
  const { getToken } = useAuth();
  const { updateCount } = useGame(); // trigger refresh when a claim/unclaim occurs
  const [totalDistance, setTotalDistance] = useState(0);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalDistance = async () => {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      try {
        // Fetch all routes
        const routesResponse = await fetch('/api/routes/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const routesData = await routesResponse.json();

        // Sum distances of routes claimed by this team
        const total = routesData.reduce((sum, route) => {
          const claimedByTeam = route.team_claims?.some(
            (claim) => claim.team_id === teamId
          );
          return claimedByTeam ? sum + route.distance : sum;
        }, 0);

        setTotalDistance(total);
      } catch (error) {
        console.error('Failed to fetch routes:', error);
        setTotalDistance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalDistance();
  }, [getToken, teamId, updateCount]); // re-fetch whenever updateCount changes

  return (
    <div className="distanceContainer" style={{ backgroundColor: color }}>
          <div className="distance">{totalDistance}</div>
          <div className="km">km</div>
    </div>
  );
};

export default DistanceTracker;
