/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { useAuth } from "../authentication/AuthContext";
import { useGame } from "../contexts/GameContext";

const teamColors = {
  "0076f246-bf3c-4900-aadd-87b9a9a37452": "red",
  "79cd421b-81d4-4b00-8b59-da9e7560dc4b": "blue",
  "1446e8a4-350c-4aa1-a997-c05fb87ef102": "green",
};

const colorHex = {
  red: "#FF0000",
  blue: "rgb(0, 85, 255)",
  green: "#22a701",
};

const ConnectionLine = ({ from, to, routeInfo, userTeamId, userTeamColor }) => {
  const map = useMap();
  const { getToken } = useAuth();
  const { refreshData } = useGame();

  const [color, setColor] = useState("#000000");
  const lineRef = useRef(null);
  const infoWindowRef = useRef(null);
  const mapClickListenerRef = useRef(null);

  useEffect(() => {
    if (!routeInfo) return;

    if (routeInfo.team_claims?.length > 0) {
      const claimingTeamId = routeInfo.team_claims[0].team_id;
      const teamColor = colorHex[teamColors[claimingTeamId]] || "#000000";
      setColor(teamColor);
    } else {
      setColor("#000000");
    }
  }, [routeInfo]);

  useEffect(() => {
    if (!map || !routeInfo) return;

    const polyline = new google.maps.Polyline({
      path: [from, to],
      geodesic: false,
      strokeColor: color,
      strokeOpacity: 1,
      strokeWeight: 3,
      map,
      clickable: true,
    });

    lineRef.current = polyline;

    const closeInfoWindow = () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
    };

    const handleLineClick = (e) => {
      closeInfoWindow();

      const isUnclaimed = color === "#000000";
const normalize = (c) => c.replace(/\s+/g, "").toLowerCase();
const isOwnedByUser =
  userTeamColor && normalize(color) === normalize(userTeamColor);


      let popupContent = `
        <div style="font-family: Poppins, sans-serif; min-width:180px;">
          <p style="margin:0; font-weight:600; font-size:18px;">${routeInfo.name}</p>
          <p style="margin:2px 0 6px; font-size:16px;">Distance: ${routeInfo.distance} km</p>
      `;

      if (isUnclaimed) {
        popupContent += `<button id="claim-btn" style="padding:4px 8px;">Claim</button>`;
      } else if (isOwnedByUser) {
        popupContent += `<button id="unclaim-btn" style="padding:4px 8px;">Unclaim</button>`;
      }
      popupContent += `</div>`;

      const infoWindow = new google.maps.InfoWindow({
        position: e.latLng,
        content: popupContent,
      });
      infoWindow.open(map);
      infoWindowRef.current = infoWindow;

      google.maps.event.addListenerOnce(infoWindow, "domready", () => {
        const claimBtn = document.getElementById("claim-btn");
        const unclaimBtn = document.getElementById("unclaim-btn");

        if (claimBtn) {
          claimBtn.addEventListener("click", async () => {
            try {
              const token = await getToken();
              await fetch(`/api/routes/${routeInfo.id}/claim/`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ team_id: userTeamId }),
              });
              polyline.setOptions({ strokeColor: userTeamColor });
              setColor(userTeamColor);
              refreshData();
            } catch (err) {
              console.error("Failed to claim route:", err);
            }
            infoWindow.close();
          });
        }

        if (unclaimBtn) {
          unclaimBtn.addEventListener("click", async () => {
            try {
              const token = await getToken();
              await fetch(`/api/routes/${routeInfo.id}/unclaim/`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ team_id: userTeamId }),
              });
              polyline.setOptions({ strokeColor: "#000000" });
              setColor("#000000");
              refreshData();
            } catch (err) {
              console.error("Failed to unclaim route:", err);
            }
            infoWindow.close();
          });
        }
      });
    };

    polyline.addListener("click", handleLineClick);
    mapClickListenerRef.current = map.addListener("click", () => closeInfoWindow());

    return () => {
      polyline.setMap(null);
      if (infoWindowRef.current) infoWindowRef.current.close();
      if (mapClickListenerRef.current) {
        google.maps.event.removeListener(mapClickListenerRef.current);
      }
    };
  }, [map, from, to, color, routeInfo, userTeamColor, userTeamId, getToken, refreshData]);

  return null;
};

export default ConnectionLine;