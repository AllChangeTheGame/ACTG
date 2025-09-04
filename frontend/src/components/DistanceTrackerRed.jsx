import React, { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext';
import './DistanceTracker.css';

const DistanceTrackerRed = () => {
  const { getToken } = useAuth();
  const [redTeam, setRedTeam] = useState(null);

  // This is the known Red Team ID
  const RED_TEAM_ID = "0076f246-bf3c-4900-aadd-87b9a9a37452";

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

        // Find the Red Team by its ID
        const red = teamsData.find(team => team.id === RED_TEAM_ID);

        if (red) {
          setRedTeam({
            id: red.id,
            name: red.name,
            claimed_routes: red.claimed_routes,
            claimed_bonus_sites: red.claimed_bonus_sites,
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
    <div className='containerRed'>
      {redTeam ? (
        <>
          <div className="team-name">{redTeam.name}</div>
          <div className="distance">100 km</div>
        </>
      ) : (
        <div className="loading">Loading Red Team...</div>
      )}
    </div>
  );
};

export default DistanceTrackerRed;
