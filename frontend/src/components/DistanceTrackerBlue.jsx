import React, { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext';
import './DistanceTracker.css';

const DistanceTrackerBlue = () => {
  const { getToken } = useAuth();
  const [blueTeam, setBlueTeam] = useState(null);

  // This is the known blue Team ID
  const BLUE_TEAM_ID = "79cd421b-81d4-4b00-8b59-da9e7560dc4b";

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

        // Find the blue Team by its ID
        const blue = teamsData.find(team => team.id === BLUE_TEAM_ID);

        if (blue) {
          setBlueTeam({
            id: blue.id,
            name: blue.name,
            claimed_routes: blue.claimed_routes,
            claimed_bonus_sites: blue.claimed_bonus_sites,
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
    <div className='containerBlue'>
      {blueTeam ? (
        <>
          <div className="team-name">{blueTeam.name}</div>
          <div className="distance">100 km</div>
        </>
      ) : (
        <div className="loading">Loading Blue Team...</div>
      )}
    </div>
  );
};

export default DistanceTrackerBlue;
