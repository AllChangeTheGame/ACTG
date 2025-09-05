import React from "react";
import { useNavigate } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import MoneyTracker from "../components/MoneyTracker";
import DistanceTracker from "../components/DistanceTracker";
import { auth } from "../authentication/firebase";
import { signOut } from "firebase/auth";
import "./Home.css"; // create this CSS file

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth);
  };

  const handleMenuClick = () => {
    navigate("/menu"); // this page will be created later
  };

  return (
    <div className="homeContainer">
      {/* Top bar with logo and menu */}
      <header className="topBar">
        <img src="/logo.png" alt="Logo" className="logo" />
        <button className="menuButton" onClick={handleMenuClick}>
          Menu
        </button>
      </header>

      <h1>All Change: The Game</h1>

      <div className="mapContainer">
        <MapComponent />
      </div>

      <div className="distanceTrackers">
        <DistanceTracker teamId="0076f246-bf3c-4900-aadd-87b9a9a37452" />
        <DistanceTracker teamId="1446e8a4-350c-4aa1-a997-c05fb87ef102" />
        <DistanceTracker teamId="79cd421b-81d4-4b00-8b59-da9e7560dc4b" />
      </div>

      <MoneyTracker />

      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}

export default Home;
