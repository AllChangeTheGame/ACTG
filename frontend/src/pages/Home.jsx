import React from 'react';
import MapComponent from "../components/MapComponent";

function Home() {
  return (
    <div>
        <h1>All Change: The Game</h1>
        <div className="mapContainer">
            <MapComponent />
        </div>
    </div>
  )
}

export default Home