import React, { useState } from "react";
import MapComponent from "../components/MapComponent";
import MoneyTracker from "../components/MoneyTracker";
import DistanceTracker from "../components/DistanceTracker";
import { auth } from "../authentication/firebase";
import { signOut } from "firebase/auth";
import "./Home.css";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="homeContainer">

      <div className="mapContainer">
        <MapComponent/>
      </div>

      <header className="topBar">
        <img src="../../public/Logo.png" alt="Logo" className="logo" />
        <h1 className="title">All Change: The Game</h1>
        <button className="menuButton" onClick={toggleMenu}>
          ☰
        </button>
      </header>

      <div className={`slideMenu ${menuOpen ? "open" : ""}`}>
        <button className="closeButton" onClick={toggleMenu}>
          ×
        </button>
        <h2>Menu</h2>
        <ul>
          <li><button onClick={() => alert("Profile clicked")}>Shop</button></li>
          <li><button onClick={() => alert("Settings clicked")}>Reference</button></li>
          <li><button onClick={() => alert("Settings clicked")}>Tools</button></li>
          <li><button onClick={() => alert("Settings clicked")}>Delay Calculator</button></li>
          <li><button onClick={() => alert("Settings clicked")}>Inventory</button></li>
          <li><button onClick={() => alert("Settings clicked")}>Veto Tracker</button></li>
          <li><button onClick={() => alert("Settings clicked")}>Complete Card, Veto Card, </button></li>
          <li><button onClick={handleLogout}>Log out</button></li>
        </ul>
      </div>

      <div className="overlayContent">

        <div className="bottomOfScreenComponents">
          <div className="distanceTrackers">
            <DistanceTracker teamId="0076f246-bf3c-4900-aadd-87b9a9a37452" color={"red"}/>
            <DistanceTracker teamId="1446e8a4-350c-4aa1-a997-c05fb87ef102" color={"green"} />
            <DistanceTracker teamId="79cd421b-81d4-4b00-8b59-da9e7560dc4b" color={"blue"} />
          </div>

          <MoneyTracker />
        </div>
      </div>

    </div>
  );
}

export default Home;
