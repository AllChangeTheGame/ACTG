// src/components/MenuBar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../authentication/firebase";
import { signOut } from "firebase/auth";
import logo from "../../public/Logo.png";
import "./MenuBar.css";

const MenuBar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleReference = () => setReferenceOpen((prev) => !prev);

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <>
      {/* --- TOP BAR --- */}
      <header className="topBar">
        <img
          src={logo}
          alt="Logo"
          className="logo"
          onClick={() => handleNavigate("/")}
          style={{ cursor: "pointer" }}
        />
        <button className="menuButton" onClick={toggleMenu}>
          ☰
        </button>
      </header>

      {/* --- SLIDE MENU --- */}
      <div className={`slideMenu ${menuOpen ? "open" : ""}`}>
        <button className="closeButton" onClick={toggleMenu}>
          ×
        </button>
        <h2>Menu</h2>

        <ul>
          <li>
            <button onClick={() => handleNavigate("/")}>Home</button>
          </li>
          <li>
            <button onClick={() => handleNavigate("/shop")}>Shop</button>
          </li>
          {/* <li>
            <button onClick={() => handleNavigate("/screwyoucards")}>
              Screw you cards
            </button>
          </li> */}
          <li>
            <button onClick={toggleReference}>
              Reference {referenceOpen ? "▲" : "▼"}
            </button>
            {referenceOpen && (
              <ul className="submenu">
                <li>
                  <button onClick={() => handleNavigate("/specialrules")}>
                    Special rules
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate("/transactions")}>
                    Transaction history
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate("/links")}>
                    Useful links
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate("/delays")}>
                    Delays and cancellations
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate("/tiebreaks")}>
                    Tie breaks
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate("/guides")}>
                    National cuisine guides
                  </button>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={handleLogout}>
              <strong>Log out</strong>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default MenuBar;