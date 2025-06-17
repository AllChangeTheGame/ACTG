import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import cityMarker from '../../src/assets/city-marker.png';
import ConnectionLine from './ConnectionLine';
import { useAuth } from '../authentication/AuthContext';


// const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// const locations = [
//   { key: 'paris', location: { lat: 48.845883543230336, lng: 2.3743771440601504 }},
//   { key: 'bern', location: { lat: 46.94917211206116, lng: 7.438470637142327 }},
//   { key: 'berlin', location: { lat: 52.52581319443291, lng: 13.369659346416274 }},
//   { key: 'prague', location: { lat: 50.083867877487414, lng: 14.435563239511898 }},
//   { key: 'vienna', location: { lat: 48.18598661059356, lng: 16.376253819543926 }},
// ];

const MapComponent = () => {

  const { getToken, team } = useAuth();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      const token = await getToken();

      if (!token) {
        console.error("No authentication token");
        return;
      }
      try {
        const response = await fetch('/api/cities/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        
        const data = await response.json();

        const formatted = data.map(city => ({
          key: city.id,
          name: city.name,
          location: {
            lat: city.latitude,
            lng: city.longitude
          }
        }));
        setLocations(formatted);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      }
    };

    fetchLocations();
  }, [getToken]);

  if (loading) return <p>Loading map...</p>;

  // Temporary until routes API up and running
  const paris = locations.find(loc => loc.name === 'Paris');
  const berlin = locations.find(loc => loc.name === 'Berlin');
  const bern = locations.find(loc => loc.name === 'Bern');
  const prague = locations.find(loc => loc.name === 'Prague');

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultZoom={6}
        defaultCenter={{ lat: 49.206117, lng: 9.973547 }}
        mapId="b4d8a034a2c8ed5b"
        streetViewControl={false}
        mapTypeControl= {false}
        fullscreenControl= {false}
        onCameraChanged={(ev) => {
          console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom);
        }}
      >
        <PoiMarkers pois={locations} />

        {/* Temporary until routes API up and running   */}
        {paris && berlin && <ConnectionLine from={paris.location} to={berlin.location} team={team} />}
        {paris && bern && <ConnectionLine from={paris.location} to={bern.location} team={team} />}
        {berlin && prague && <ConnectionLine from={berlin.location} to={prague.location} team={team} />}

      </Map>
    </APIProvider>
  );
};

const PoiMarkers = ({ pois }) => {
  const map = useMap();
  const [markers, setMarkers] = useState({});
  const clusterer = useRef(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker, key) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers(prev => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  const handleClick = useCallback((ev) => {
    if (!map || !ev.latLng) return;
    console.log('marker clicked:', ev.latLng.toString());
    map.panTo(ev.latLng);
  }, [map]);

  return (
    <>
      {pois.map((poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={marker => setMarkerRef(marker, poi.key)}
          clickable={true}
          onClick={handleClick}
        >
          <img
            src={cityMarker}
            alt="city-marker"
            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default MapComponent;
