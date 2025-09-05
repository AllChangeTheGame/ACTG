import React, { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext';
import './DistanceTracker.css';

const DistanceTracker = ({ teamId, color }) => {
  const { getToken } = useAuth();
  const [team, setTeam] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);

  useEffect(() => {
    const fetchTeamData = async () => {
      const token = await getToken();
      if (!token) return;

      try {
        // Fetch all teams
        const teamsResponse = await fetch('/api/teams/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const teamsData = await teamsResponse.json();

        const selectedTeam = teamsData.find(t => t.id === teamId);
        if (selectedTeam) {
          setTeam(selectedTeam);

          // Fetch all routes
          const routesResponse = await fetch('/api/routes/', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const routesData = await routesResponse.json();

          // Sum distances of the team's claimed routes
          const total = selectedTeam.claimed_routes.reduce((sum, routeId) => {
            const route = routesData.find(r => r.id === routeId);
            return route ? sum + route.distance : sum;
          }, 0);

          setTotalDistance(total);
        }
      } catch (error) {
        console.error('Failed to fetch team or route data', error);
      }
    };

    fetchTeamData();
  }, [getToken, teamId]);

  return (
    <div className={`container`} style={{ backgroundColor: color }}>
      {team ? (
        <>
          <div className="team-name">{team.name}</div>
          <div className="distance">{totalDistance} km</div>
        </>
      ) : (
        <div className="loading">Loading team...</div>
      )}
    </div>
  );
};

export default DistanceTracker;