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
};

const ConnectionLine = ({ from, to, routeId }) => {
  const map = useMap();
  const { getToken } = useAuth();

  const [color, setColor] = useState('#000000');
  const [userTeamColor, setUserTeamColor] = useState(null);
  const [userTeamId, setUserTeamId] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  const lineRef = useRef(null);
  const mapClickListenerRef = useRef(null);

  // Fetch user team info
  useEffect(() => {
    const fetchTeamInfo = async () => {
      const token = await getToken();
      try {
        const res = await fetch('/api/users/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUserTeamId(data.team_id);
        const colorName = teamColors[data.team_id];
        setUserTeamColor(colorName ? colorHex[colorName] : null);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    };
    fetchTeamInfo();
  }, [getToken]);

  // Fetch route info and current claim status
  useEffect(() => {
    const fetchRouteStatus = async () => {
      if (!routeId) return;
      const token = await getToken();
      try {
        const res = await fetch(`/api/routes/${routeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const routeData = await res.json();
        setRouteInfo(routeData);

        if (routeData.team_claims && routeData.team_claims.length > 0) {
          const claimingTeamId = routeData.team_claims[0].team_id;
          const teamColorName = teamColors[claimingTeamId];
          const teamHex = colorHex[teamColorName] || '#000000';
          setColor(teamHex);
        } else {
          setColor('#000000');
        }
      } catch (err) {
        console.error('Failed to fetch route status:', err);
      }
    };
    fetchRouteStatus();
  }, [getToken, routeId]);

  // Draw and handle interactions
  useEffect(() => {
    if (!map || !routeInfo) return;

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

    const closeInfoWindow = () => {
      if (infoWindow) {
        infoWindow.close();
        setInfoWindow(null);
      }
    };

    const handleLineClick = (e) => {
      closeInfoWindow();

      const isUnclaimed = color === '#000000';
      const isOwnedByUser =
        userTeamColor && color.toLowerCase() === userTeamColor.toLowerCase();

      let popupContent = `
        <div id="popup-container" style="font-family: Poppins, sans-serif; min-width: 180px; position: relative;">
          <p style="margin:0; font-weight:600; font-size:18px;">${routeInfo.name}</p>
          <p style="margin:2px 0 6px; font-size:16px;">Distance: ${routeInfo.distance} km</p>
      `;

      if (isUnclaimed) {
        popupContent += `<button id="claim-btn" style="padding:4px 8px;">Claim</button>`;
      } else if (isOwnedByUser) {
        popupContent += `<button id="unclaim-btn" style="padding:4px 8px;">Unclaim</button>`;
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
        const closeX = document.querySelector('#popup-container .x-button');

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
              polyline.setOptions({ strokeColor: userTeamColor });
              setColor(userTeamColor);
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

        // Attach to your existing "×" button if present
        if (closeX) {
          closeX.addEventListener('click', () => {
            newWindow.close();
          });
        }
      });
    };

    polyline.addListener('click', handleLineClick);
    mapClickListenerRef.current = map.addListener('click', () => closeInfoWindow());

    return () => {
      polyline.setMap(null);
      if (infoWindow) infoWindow.close();
      if (mapClickListenerRef.current) {
        google.maps.event.removeListener(mapClickListenerRef.current);
      }
    };
  }, [map, from, to, color, routeInfo, userTeamColor, userTeamId, infoWindow, routeId, getToken]);

  return null;
};

export default ConnectionLine;