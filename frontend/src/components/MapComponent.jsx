import React, { useEffect, useState, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import cityMarker from '../../src/assets/city-marker.png';
import bonusSiteMarker from '../../src/assets/bonus-site-marker.png';
import ConnectionLine from './ConnectionLine';
import { useAuth } from '../authentication/AuthContext';

const useZoomSize = (minSize, maxSize, minZoom = 5, maxZoom = 10) => {
    const map = useMap();
    const [currentZoom, setCurrentZoom] = useState(map ? map.getZoom() : minZoom);

    useEffect(() => {
        if (!map) return;
        const listener = map.addListener('zoom_changed', () => {
            setCurrentZoom(map.getZoom());
        });
        return () => {
            if (listener) {
                if (typeof listener.remove === 'function') {
                    listener.remove();
                }
            }
        };
    }, [map]);

    const zoomFactor = Math.min(1, Math.max(0, (currentZoom - minZoom) / (maxZoom - minZoom)));
    const size = minSize + (maxSize - minSize) * zoomFactor;

    return size;
};

const MapComponent = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [bonusSites, setBonusSites] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);

  const handleMapClick = () => {
    setSelectedPoi(null);
  };
  
  const handleMarkerClick = useCallback((poi) => {
    setSelectedPoi(prevPoi => (prevPoi && prevPoi.id === poi.id) ? null : poi);
  }, []);

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
          name: site.site_name,
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
        defaultZoom={5.3}
        defaultCenter={{ lat: 48.206117, lng: 9.973547 }}
        mapId="b4d8a034a2c8ed5b"
        streetViewControl={false}
        mapTypeControl={false}
        fullscreenControl={false}
        onClick={handleMapClick}
      >
        <PoiMarkers pois={cities} icon={cityMarker} minSize={20} maxSize={45} onMarkerClick={handleMarkerClick} />
        <PoiMarkers pois={bonusSites} icon={bonusSiteMarker} minSize={10} maxSize={35} onMarkerClick={handleMarkerClick} />

        {routes.map((route) => {
          const start = cities.find(city => city.id === route.start_city_id);
          const end = cities.find(city => city.id === route.end_city_id);
          if (!start || !end) return null;

          return (
            <ConnectionLine
              key={route.id}
              from={start.location}
              to={end.location}
              routeId={route.id}
            />
          );
        })}

        {selectedPoi && (
          <InfoWindow
            position={selectedPoi.location}
            onCloseClick={() => setSelectedPoi(null)}
          >
            <div style={{ padding: '5px', fontWeight: 'bold' }}>
              {selectedPoi.name}
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
};

const PoiMarkers = ({ pois, icon, minSize, maxSize, onMarkerClick }) => {
  const map = useMap();
  const calculatedSize = useZoomSize(minSize, maxSize);
  const imageSize = `${calculatedSize}px`;
    

  const handleClick = useCallback((poi, ev) => {
    if (!map) return;
    onMarkerClick(poi);
    if (ev.latLng) {
      map.panTo(ev.latLng);
    }
  }, [map, onMarkerClick]);

  return (
    <>
      {pois.map((poi) => (
        <AdvancedMarker
          key={poi.id}
          position={poi.location}
          clickable={true}
          onClick={(ev) => handleClick(poi, ev)}
        >
          <img
            src={icon}
            alt="poi-marker"
            style={{ width: imageSize, height: imageSize, objectFit: 'contain', transform: 'translate(0%, 50%)' }}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default MapComponent;
