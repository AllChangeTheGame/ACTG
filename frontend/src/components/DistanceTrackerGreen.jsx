import React, { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext';
import './DistanceTracker.css';

const DistanceTrackerGreen = () => {
  const { getToken } = useAuth();
  const [greenTeam, setGreenTeam] = useState(null);

  // This is the known Green Team ID
  const GREEN_TEAM_ID = "1446e8a4-350c-4aa1-a997-c05fb87ef102";

  useEffect(() => {
    const fetchLocations = async () => {
      const token = await getToken();

      if (!token) {
        console.error("No authentication token");
        return;
      }

      try {
        const teamsResponse = await fetch('/api/teams/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const teamsData = await teamsResponse.json();

        // Find the Green Team by its ID
        const green = teamsData.find(team => team.id === GREEN_TEAM_ID);

        if (green) {
          setGreenTeam({
            id: green.id,
            name: green.name,
            claimed_routes: green.claimed_routes,
            claimed_bonus_sites: green.claimed_bonus_sites,
          });
        }

      } catch (error) {
        console.error('Failed to fetch team data', error);
      }
    };

    fetchLocations();
  }, [getToken]);

// Need a distance route within the team API

  return (
    <div className='containerGreen'>
      {greenTeam ? (
        <>
          <div className="team-name">{greenTeam.name}</div>
          <div className="distance">100 km</div>
        </>
      ) : (
        <div className="loading">Loading Green Team...</div>
      )}
    </div>
  );
};

export default DistanceTrackerGreen;
