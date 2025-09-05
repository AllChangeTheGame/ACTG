import React, { useEffect, useState, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from '@vis.gl/react-google-maps';
import cityMarker from '../../src/assets/city-marker.png';
import bonusSiteMarker from '../../src/assets/bonus-site-marker.png';
import ConnectionLine from './ConnectionLine';
import { useAuth } from '../authentication/AuthContext';

const MapComponent = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [bonusSites, setBonusSites] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const token = await getToken();

      if (!token) {
        console.error("No authentication token");
        return;
      }

      try {
        const [citiesResponse, routesResponse, bonusSitesResponse] = await Promise.all([
          fetch('/api/cities/', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('/api/routes/', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('/api/bonus-sites/', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const citiesData = await citiesResponse.json();
        const routesData = await routesResponse.json();
        const bonusSitesData = await bonusSitesResponse.json();

        const formattedCities = citiesData.map(city => ({
          id: city.id,
          name: city.name,
          location: {
            lat: city.latitude,
            lng: city.longitude
          }
        }));

        const formattedBonusSites = bonusSitesData.map(site => ({
          id: site.id,
          name: site.name,
          location: {
            lat: site.latitude,
            lng: site.longitude
          }
        }));

        setCities(formattedCities);
        setBonusSites(formattedBonusSites);
        setRoutes(routesData);
        setLoading(false);

      } catch (error) {
        console.error('Failed to fetch city and routes data:', error);
      }
    };

    fetchLocations();
  }, [getToken]);

  if (loading) return <p>Loading map...</p>;

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultZoom={6}
        defaultCenter={{ lat: 49.206117, lng: 9.973547 }}
        mapId="b4d8a034a2c8ed5b"
        streetViewControl={false}
        mapTypeControl={false}
        fullscreenControl={false}
        // onCameraChanged={(ev) => {
        //   console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom);
        // }}
      >
        <PoiMarkers pois={cities} icon={cityMarker} />
        <PoiMarkers pois={bonusSites} icon={bonusSiteMarker} />

        {routes.map((route) => {
          const start = cities.find(city => city.id === route.start_city_id);
          const end = cities.find(city => city.id === route.end_city_id);
          if (!start || !end) return null;

          return (
            <ConnectionLine
              key={route.id}
              from={start.location}
              to={end.location}
            />
          );
        })}
      </Map>
    </APIProvider>
  );
};

const PoiMarkers = ({ pois, icon }) => {
  const map = useMap();

  const handleClick = useCallback((ev) => {
    if (!map || !ev.latLng) return;
    console.log('marker clicked:', ev.latLng.toString());
    map.panTo(ev.latLng);
  }, [map]);

  return (
    <>
      {pois.map((poi) => (
        <AdvancedMarker
          key={poi.id}
          position={poi.location}
          clickable={true}
          onClick={handleClick}
        >
          <img
            src={icon}
            alt="poi-marker"
            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default MapComponent;
