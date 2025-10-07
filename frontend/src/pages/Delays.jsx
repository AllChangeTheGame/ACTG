import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../authentication/firebase";
import { signOut } from "firebase/auth";
import './Delays.css';

const Delays = () => {
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
                <li><button onClick={() => navigate("/links")}>Useful links</button></li>
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
    <div className="shop-header compact-header">
      <Clock className="shop-header-icon" />
      <h1 className="shop-title">DELAYS & CANCELLATIONS</h1>
    </div>

    <section className="rules-section">
      <p className="combined-text">
        When a ticket is “purchased” the arrival time is set at the scheduled/projected arrival time of that train at that moment. For every minute (after 15 minutes) that you arrive after that pre-set arrival time at your destination, you will accrue one minute in a veto bank, that can be used to reduce veto time for future challenge card draws.
      </p>
      <p className="combined-text">
        Once a ticket is “purchased”, it cannot be refunded. If the train is delayed after “purchasing” a ticket, then that ticket can transfer to another train on the same route if it is projected to arrive before your delayed train’s projected arrival time. If the train is cancelled or a delay means that there is not another train to your destination which will arrive within 90 minutes of your original scheduled/projected arrival time, you may take a full refund, and choose to travel along another route following the standard rules. If you continue on to your original destination after a cancellation, you continue to accrue veto time as normal.
      </p>
      <p className="combined-text">
        <strong>Swapping for skips: </strong>
        If a team’s veto bank is in excess of 90 minutes, then they may choose at any time to swap 90 minutes of veto bank for a free ‘skip’.
      </p>
      <p className="combined-text">
        <strong>Cancellations from starting city: </strong>
        If your train is cancelled from the starting city, then you will still receive a full refund, and will also get a 50% discount on the next train, as well as still accruing veto bank as described above. 
      </p>
      <p className="combined-text">
        <strong>Cancellations between cities: </strong>
        If your train is cancelled in between cities, and you are still able to reach your destination, then you accrue veto bank as above. If it is no longer possible or practical for you to reach your destination, then you may return to any other city on the map (which is accessible by rail without passing through another city on the map) for free, and take one free ‘skip’ in that city. You may continue on to another city if possible, but you must pay the respective fare.
      </p>
      <p className="combined-text">
        <strong>Free routes:</strong> You cannot “purchase” a ticket on a free route (less than 100km). However, a veto bank can still accrue based on the delay at the destination vs the delay on departure. A cancellation follows the same rules as above.
      </p>
    </section>
  </div>
</div>

);
};

export default Delays;
