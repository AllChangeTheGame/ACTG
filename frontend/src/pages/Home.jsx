import React, { useState } from "react";
import MapComponent from "../components/MapComponent";
import MoneyTracker from "../components/MoneyTracker";
import DistanceTracker from "../components/DistanceTracker";
import { auth } from "../authentication/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState(false); // NEW state for submenu
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleReference = () => {
    setReferenceOpen((prev) => !prev);
  };

  return (
    <div className="homeContainer">

      <div className="mapContainer">
        <MapComponent/>
      </div>

      <header className="topBar">
        <img src="../../Logo.png" alt="Logo" className="logo" />
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
          <li><button onClick={() => navigate("/shop")}>Shop</button></li>
          <li>
            <button onClick={toggleReference}>
              Reference {referenceOpen ? "▲" : "▼"}
            </button>
            {referenceOpen && (
              <ul className="submenu">
                <li><button onClick={() => navigate("/rules")}>Rules</button></li>
                <li><button onClick={() => alert("Guides clicked")}>Guides</button></li>
                <li><button onClick={() => navigate("/transactions")}>Transaction History</button></li>
                <li><button onClick={() => alert("Delay Calculator clicked")}>Delay Calculator</button></li>
              </ul>
            )}
          </li>
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
