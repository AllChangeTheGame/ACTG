/* eslint-disable no-undef */
import React, { useEffect, useState, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

const teamColors = {
  blue: '#0000FF',
  red: '#FF0000',
  green: '#00FF00',
  grey: '#888888', // Treat grey as a team for now, this encompasses users without a team
};

const ConnectionLine = ({ from, to, team }) => {
  const map = useMap();
  const [color, setColor] = useState('#000000');
  const [infoWindow, setInfoWindow] = useState(null);
  const lineRef = useRef(null);

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
      if (infoWindow) {
        infoWindow.close();
      }

      const effectiveTeam = team || 'grey';
      const teamColor = teamColors[effectiveTeam.toLowerCase()];
      const currentColor = color.toLowerCase();

      let popupContent = `<div style="font-family: sans-serif;">`;

      if (currentColor === '#000000') {
        popupContent += `<button id="claim-btn">Claim</button>`;
      } else if (currentColor === teamColor.toLowerCase()) {
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
            polyline.setOptions({ strokeColor: teamColor });
            setColor(teamColor);
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
  }, [map, from, to, color, team]);

  return null;
};

export default ConnectionLine;
