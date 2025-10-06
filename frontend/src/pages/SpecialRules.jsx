import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../authentication/firebase";
import { signOut } from "firebase/auth";
import './SpecialRules.css';

const franceRoutes = [
{ route: 'Lille - Paris', price: '€110' },
{ route: 'Lyon - Montpellier', price: '€100' },
{ route: 'Lyon - Marseille', price: '€120' },
{ route: 'Nantes - Paris', price: '€150' },
{ route: 'Paris - Bordeaux', price: '€300' },
{ route: 'Paris - Strasbourg', price: '€240' },
{ route: 'Paris - Lyon', price: '€220' },
{ route: 'Rennes - Paris', price: '€170' },
{ route: 'Tour - Paris', price: '€90' },
{ route: 'Tour - Bordeaux', price: '€120' },
];

const cityChallengeModifiers = [
{ challenge: 'Fourth Challenge', multiple: '0.9' },
{ challenge: 'Fifth Challenge', multiple: '0.8' },
{ challenge: 'Sixth Challenge', multiple: '0.7' },
{ challenge: 'Seventh Challenge', multiple: '0.6' },
{ challenge: 'Eighth Challenge or More', multiple: '0.5' },
];

const SpecialRules = () => {
const navigate = useNavigate();
const [menuOpen, setMenuOpen] = useState(false);
const [referenceOpen, setReferenceOpen] = useState(false);

const toggleMenu = () => setMenuOpen(!menuOpen);
const toggleReference = () => setReferenceOpen(!referenceOpen);
const handleNavigate = (path) => {
setMenuOpen(false);
navigate(path);
};

  const handleLogout = () => {
    signOut(auth);
  };

return ( <div className="shop-container">
{/* --- TOP BAR --- */} <header className="topBar">
<img
src="../../Logo.png"
alt="Logo"
className="logo"
onClick={() => handleNavigate('/')}
style={{ cursor: 'pointer' }}
/> <button className="menuButton" onClick={toggleMenu}>☰</button> </header>

```
  {/* --- SLIDE MENU --- */}
  <div className={`slideMenu ${menuOpen ? 'open' : ''}`}>
    <button className="closeButton" onClick={toggleMenu}>×</button>
    <h2>Menu</h2>
    
        <ul>
          <li><button onClick={() => navigate("/shop")}>Shop</button></li>
          <li><button onClick={() => navigate("/screwyoucards")}>Screw you cards</button></li>
          <li>
            <button onClick={toggleReference}>
              Reference {referenceOpen ? "▲" : "▼"}
            </button>
            {referenceOpen && (
              <ul className="submenu">
                <li><button onClick={() => navigate("/specialrules")}>Special rules</button></li>
                <li><button onClick={() => navigate("/transactions")}>Transaction history</button></li>
                <li><button onClick={() => navigate("/delays")}>Delays and cancellations</button></li>
                <li><button onClick={() => navigate("/guides")}>National cuisine guides</button></li>
              </ul>
        )}
      </li>
      <li><button onClick={handleLogout}><strong>Log out</strong></button></li>
    </ul>
  </div>

  {/* --- MAIN CONTENT --- */}
  <div className="shop-content-wrapper main-content-padding">
    <div className="rules-header">
      <h1 className="rules-title">SPECIAL RULES</h1>
    </div>
    
    {/* GERMANY MODIFIER */}
    <section className="rules-section">
      <h2>Germany route price modifier</h2>
      <p className="card-comments">
        All routes to, from, and within <strong>Germany</strong> are <strong>0.7×</strong> the ticket price quoted online.
      </p>
    </section>

    {/* FREE ROUTES */}
    <section className="rules-section">
      <h2>Free Routes</h2>
      <p className="card-comments">
        Any routes that are <strong>100km or less</strong> are free and do not cost money from the bank. 
        These routes must still start in a city where you have completed a challenge (if you have not used a ‘skip’).
      </p>
    </section>

    {/* FRANCE ROUTES */}
    <section className="rules-section">
      <h2>France minimum route prices</h2>
      <p className="card-comments">*Price per team (two tickets)</p>
      <table className="rules-table">
        <thead>
          <tr>
            <th>Route</th>
            <th>Per Team Minimum Price</th>
          </tr>
        </thead>
        <tbody>
          {franceRoutes.map((item, idx) => (
            <tr key={idx}>
              <td>{item.route}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>


    {/* CITY CHALLENGE MODIFIERS */}
    <section className="rules-section">
      <h2>Multiple challenges modifiers</h2>
      <p className="card-comments">
        If you complete four or more challenges in one city (without leaving), apply the following reward multipliers:
      </p>
      <table className="rules-table">
        <thead>
          <tr>
            <th>Number of Challenges in One City</th>
            <th>Multiple Applied</th>
          </tr>
        </thead>
        <tbody>
          {cityChallengeModifiers.map((item, idx) => (
            <tr key={idx}>
              <td>{item.challenge}</td>
              <td>{item.multiple}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  </div>
</div>

);
};

export default SpecialRules;
