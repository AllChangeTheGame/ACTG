/* eslint-disable no-undef */
import React, { useEffect, useState, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

const ConnectionLine = ({ from, to }) => {
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

      const newWindow = new google.maps.InfoWindow({
        position: e.latLng,
        content: `
          <div style="font-family: sans-serif;">
            <button id="change-color-btn">Claim Route</button>
          </div>
        `,
      });

      newWindow.open(map);
      setInfoWindow(newWindow);

      google.maps.event.addListenerOnce(newWindow, 'domready', () => {
        const button = document.getElementById('change-color-btn');
        if (button) {
          button.addEventListener('click', () => {
            const newColor = color === '#FF0000' ? '#00AAFF' : '#FF0000';
            polyline.setOptions({ strokeColor: newColor });
            setColor(newColor);
          });
        }
      });
    };

    polyline.addListener('click', handleClick);

    return () => {
      polyline.setMap(null);
      if (infoWindow) {
        infoWindow.close();
      }
    };
  }, [map, from, to, color, infoWindow]);

  return null;
};

export default ConnectionLine;

