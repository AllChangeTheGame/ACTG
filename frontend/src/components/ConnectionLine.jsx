/* eslint-disable no-undef */
import React, { useEffect, useState, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { useAuth } from '../authentication/AuthContext';

const teamColors = {
  '0076f246-bf3c-4900-aadd-87b9a9a37452': 'red',
  // Get other team_ids
};

const colorHex = {
  red: '#FF0000',
  blue: '#0000FF',
  green: '#00FF00',
  grey: '#888888',
};

const ConnectionLine = ({ from, to }) => {
  const map = useMap();
  const { getToken } = useAuth();

  const [color, setColor] = useState('#000000');
  const [userTeamColor, setUserTeamColor] = useState('grey');
  const [infoWindow, setInfoWindow] = useState(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const fetchTeamColor = async () => {
        const token = await getToken();

      try {
        const response = await fetch('/api/users/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        const teamId = data.team_id;
        const teamColor = teamColors[teamId] || 'grey';
        setUserTeamColor(teamColor);

      } catch (err) {
        console.error('Failed to fetch user info:', err);
        setUserTeamColor('grey');
      }
    };

    fetchTeamColor();
  }, [getToken]);

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

      if (currentColor === '#000000') { // Logic to be added for 'free route' button- only applicable for routes less than 100km
        popupContent += `<button id="claim-btn">Claim</button><button id="buy-ticket-btn">Buy Ticket</button>`;
      } else if (currentColor === teamHex.toLowerCase()) {
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
          claimBtn.addEventListener('click', () => {
            polyline.setOptions({ strokeColor: teamHex });
            setColor(teamHex);
            newWindow.close();
          });
        }

        if (unclaimBtn) {
          unclaimBtn.addEventListener('click', () => {
            polyline.setOptions({ strokeColor: '#000000' });
            setColor('#000000');
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
  }, [map, from, to, color, userTeamColor]);

  return null;
};

export default ConnectionLine;