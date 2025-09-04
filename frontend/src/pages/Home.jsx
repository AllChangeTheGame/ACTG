import React from 'react';
import MapComponent from "../components/MapComponent";
import MoneyTracker from "../components/MoneyTracker";
import DistanceTrackerRed from "../components/DistanceTrackerRed";
import DistanceTrackerBlue from "../components/DistanceTrackerBlue";
import DistanceTrackerGreen from "../components/DistanceTrackerGreen";
import { auth } from "../authentication/firebase";
import { signOut } from "firebase/auth";

function Home() {
  
  const handleLogout = () => {
  signOut(auth);
};

  return (
    <div>
        <h1>All Change: The Game</h1>
        <div className="mapContainer">
            <MapComponent />
        </div>
        <DistanceTrackerGreen />
        <DistanceTrackerBlue />
        <DistanceTrackerRed />
        <MoneyTracker />
      <button onClick={handleLogout}>Log out</button>
    </div>
  )
}

export default Home