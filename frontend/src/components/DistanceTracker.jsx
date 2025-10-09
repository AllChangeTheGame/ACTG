// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../authentication/AuthContext';
// import { useGame } from '../contexts/GameContext';
// import './DistanceTracker.css';

// const DistanceTracker = ({ teamId, teamName, color }) => {
//   const { getToken } = useAuth();
//   const { updateCount } = useGame();
//   const [totalDistance, setTotalDistance] = useState(0);
//   const [, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTotalDistance = async () => {
//       setLoading(true);
//       const token = await getToken();
//       if (!token) return;

//       try {
//         const [routesResponse, sitesResponse] = await Promise.all([
//           fetch('/api/routes/', { headers: { Authorization: `Bearer ${token}` } }),
//           fetch('/api/bonus-sites/', { headers: { Authorization: `Bearer ${token}` } }),
//         ]);

//         const [routesData, sitesData] = await Promise.all([
//           routesResponse.json(),
//           sitesResponse.json(),
//         ]);

//         const routesTotal = routesData.reduce((sum, route) => {
//           const claimedByTeam = route.team_claims?.some(
//             (claim) => claim.team_id === teamId
//           );
//           return claimedByTeam ? sum + route.distance : sum;
//         }, 0);

//         const sitesTotal = sitesData.reduce((sum, site) => {
//           const claimedByTeam = site.team_claims?.some(
//             (claim) => claim.team_id === teamId
//           );
//           return claimedByTeam ? sum + site.site_value : sum;
//         }, 0);

//         setTotalDistance(routesTotal + sitesTotal);
//       } catch (error) {
//         console.error('Failed to fetch routes:', error);
//         setTotalDistance(0);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTotalDistance();
//   }, [getToken, teamId, updateCount]);

//   return (
//     <div className="distanceContainer" style={{ backgroundColor: color }}>
//       <div className="teamName">{teamName}</div>
//       <div className="distance">{totalDistance}</div>
//       <div className="km">km</div>
//     </div>
//   );
// };

// export default DistanceTracker;

// ////////

import React, { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext';
import { useGame } from '../contexts/GameContext';
import './DistanceTracker.css';

const DistanceTracker = ({ teamId, teamName, color }) => {
  const { getToken } = useAuth();
  const { updateCount } = useGame();
  const [totalDistance, setTotalDistance] = useState(0);
  const [, setLoading] = useState(true);

  const fetchClaimedDistance = async () => {
    const token = await getToken();
    console.log(token)
   try {
    const response = await fetch(`/api/claimed-distance/${teamId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setTotalDistance(data.claimed_distance);
  } catch (error) {
    console.error('Failed to fetch claimed distance:', error);
    setTotalDistance(0);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchClaimedDistance();
}, [getToken, teamId, updateCount]);


return (
<div className="distanceContainer" style={{ backgroundColor: color }}>
<div className="teamName">{teamName}</div>
<div className="distance">{totalDistance}</div>
<div className="km">km</div>
</div>
);
};

export default DistanceTracker;