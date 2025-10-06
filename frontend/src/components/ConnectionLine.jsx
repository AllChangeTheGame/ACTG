/* eslint-disable no-undef */
import React, { useEffect, useState, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { useAuth } from '../authentication/AuthContext';

const teamColors = {
  '0076f246-bf3c-4900-aadd-87b9a9a37452': 'red',
  '79cd421b-81d4-4b00-8b59-da9e7560dc4b': 'blue',
  '1446e8a4-350c-4aa1-a997-c05fb87ef102': 'green',
};

const colorHex = {
  red: '#FF0000',
  blue: '#0000FF',
  green: '#00FF00',
  grey: '#888888',
};

const ConnectionLine = ({ from, to, routeId }) => {
  const map = useMap();
  const { getToken } = useAuth();

  const [color, setColor] = useState('#000000'); // default unclaimed
  const [userTeamColor, setUserTeamColor] = useState('grey');
  const [userTeamId, setUserTeamId] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const lineRef = useRef(null);

  // Get user team info
  useEffect(() => {
    const fetchTeamInfo = async () => {
      const token = await getToken();
      try {
        const res = await fetch('/api/users/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUserTeamId(data.team_id);
        setUserTeamColor(teamColors[data.team_id] || 'grey');
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    };
    fetchTeamInfo();
  }, [getToken]);

  // Initialize route color from API
  useEffect(() => {
    const fetchRouteStatus = async () => {
      if (!routeId) return;
      const token = await getToken();
      try {
        const res = await fetch(`/api/routes/${routeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const routeData = await res.json();

        if (routeData.team_claims && routeData.team_claims.length > 0) {
          const claimingTeamId = routeData.team_claims[0]; // assume 1 team for now
          const teamColor = teamColors[claimingTeamId] || 'grey';
          setColor(colorHex[teamColor]);
        } else {
          setColor('#000000'); // unclaimed
        }
      } catch (err) {
        console.error('Failed to fetch route status:', err);
      }
    };
    fetchRouteStatus();
  }, [getToken, routeId]);

  // Draw polyline
  useEffect(() => {
    if (!map) return;

    const polyline = new google.maps.Polyline({
      path: [from, to],
      geodesic: false,
      strokeColor: color,
      strokeOpacity: 1,
      strokeWeight: 4,
      map,
      clickable: true,
    });

    lineRef.current = polyline;

    const handleClick = (e) => {
      if (infoWindow) infoWindow.close();

      const currentColor = color.toLowerCase();
      const teamHex = colorHex[userTeamColor];

      let popupContent = `<div style="font-family: sans-serif;">`;

      if (currentColor === '#000000') {
        popupContent += `<button id="claim-btn">Claim</button>`;
      } else if (userTeamId && currentColor === teamHex.toLowerCase()) {
        popupContent += `<button id="unclaim-btn">Unclaim</button>`;
      } else {
        popupContent += `<p style="margin: 0;">In Use</p>`;
      }

      popupContent += `</div>`;

      const newWindow = new google.maps.InfoWindow({
        position: e.latLng,
        content: popupContent,
      });

      newWindow.open(map);
      setInfoWindow(newWindow);

      google.maps.event.addListenerOnce(newWindow, 'domready', () => {
        const claimBtn = document.getElementById('claim-btn');
        const unclaimBtn = document.getElementById('unclaim-btn');

        if (claimBtn) {
          claimBtn.addEventListener('click', async () => {
            try {
              const token = await getToken();
              await fetch(`/api/routes/${routeId}/claim/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ team_id: userTeamId }),
              });
              polyline.setOptions({ strokeColor: teamHex });
              setColor(teamHex);
            } catch (err) {
              console.error('Failed to claim route:', err);
            }
            newWindow.close();
          });
        }

        if (unclaimBtn) {
          unclaimBtn.addEventListener('click', async () => {
            try {
              const token = await getToken();
              await fetch(`/api/routes/${routeId}/unclaim/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ team_id: userTeamId }),
              });
              polyline.setOptions({ strokeColor: '#000000' });
              setColor('#000000');
            } catch (err) {
              console.error('Failed to unclaim route:', err);
            }
            newWindow.close();
          });
        }

      });
    };

    polyline.addListener('click', handleClick);

    return () => {
      polyline.setMap(null);
      if (infoWindow) infoWindow.close();
    };
  }, [map, from, to, color, userTeamColor, userTeamId, infoWindow, routeId, getToken]);

  return null;
};

export default ConnectionLine;

