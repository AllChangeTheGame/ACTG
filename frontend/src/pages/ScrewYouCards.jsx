import React, { useState, useEffect } from 'react';
import { Zap, ShoppingCart, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../authentication/firebase";
import { signOut } from "firebase/auth";
import './ScrewYouCards.css';

const screwYouCards = {

seventyFive: [
{ id: 'slow_one', name: 'Slow One Team', impact: 'A team of your choice must pause for 45 minutes, returning to the same spot afterwards.', comments: 'This penalty must be taken within the current or next city (if on a train, in the next city). Cannot be broken up, but may be combined with veto or rest periods.' },
{ id: 'slow_both', name: 'Slow Both Teams', impact: 'Both other teams must pause for 30 minutes, returning to the same spot afterwards.', comments: 'Must be taken within the current or next city (if on a train, in the next city). Cannot be broken up, but may be combined with veto or rest periods.' },
{ id: 'half_reward', name: 'Half Reward', impact: 'All other teams get half value for their next completed challenge card.', comments: 'Effect rolls over through any vetos, free redraws, or skipped cities until a card is completed.' },
{ id: 'double_veto', name: 'Double Veto', impact: 'All other teams have their veto period doubled for their next vetoed challenge card.', comments: 'If a team uses their veto bank, they must spend double the amount. If they skip or redraw, the effect is resolved.' },
{ id: 'steal', name: 'Steal', impact: 'Take €50 from the team of your choice.', comments: 'That team can go into negative balance.' },
],
oneFifty: [
{ id: 'stop_team', name: 'Stop a Team', impact: 'A team of your choice must pause for 90 minutes, returning to the same spot afterwards.', comments: 'Must be taken within the current or next city (if on a train, in the next city). Cannot be broken up, but may be combined with veto or rest periods.' },
{ id: 'stop_both', name: 'Stop Both Teams', impact: 'All other teams must pause for 60 minutes, returning to the same spot afterwards.', comments: 'Must be taken within the current or next city (if on a train, in the next city). Cannot be broken up, but may be combined with veto or rest periods.' },
{ id: 'reserve_route', name: 'Reserve a Route', impact: 'Make one route claimable only by your team for 6 hours.', comments: 'Other teams must be notified. If another team is already travelling along that route, the card is voided and may not be replayed.' },
{ id: 'eject', name: 'Eject', impact: 'Make a team of your choice exit the train at the next station and let the train leave without them.', comments: 'Applies only to trains between cities on the map. If the chosen team is not on a train, the card is voided.' },
{ id: 'board_next', name: 'Board the Next Available Train', impact: 'Force a team to travel on the first train leaving 15 minutes after reaching the nearest central station.', comments: 'Free train; can claim a route if possible. Cannot target a team still in the starting city. Must use phone directions only and cannot walk deliberately slowly or quickly.' },
],
};

const CardItem = ({ item }) => (

  <div className="item-card">
    <div className="card-header">
      <div className="card-info">
        <div className="icon-wrapper icon-primary"><Zap className="icon-main" /></div>
        <h3 className="card-name">{item.name}</h3>
      </div>
    </div>
    <p className="card-comments"><strong>Impact:</strong> {item.impact}</p>
    <p className="card-comments">{item.comments}</p>
  </div>
);

const Popup = ({ card, onClose, loading }) => (

  <div className="popup-overlay">
    <div className={`popup-card ${loading ? 'loading' : ''}`}>
      <button className="popup-close" onClick={onClose}><X size={24} /></button>
      {loading ? (
        <div className="popup-loading">
          <Loader2 className="loading-spinner" size={40} />
          <p>Drawing your card...</p>
        </div>
      ) : (
        <>
          <div className="popup-header">
            <Zap className="popup-icon" />
            <h2>{card.name}</h2>
          </div>
          <p><strong>Impact:</strong> {card.impact}</p>
          <p>{card.comments}</p>
        </>
      )}
    </div>
  </div>
);

const ScrewYouCards = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState(false);
  const [drawnCard, setDrawnCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

const toggleMenu = () => setMenuOpen(!menuOpen);
const toggleReference = () => setReferenceOpen((prev) => !prev);
const handleNavigate = (path) => { setMenuOpen(false); navigate(path); };

  const handleLogout = () => {
    signOut(auth);
  };

const handleDraw = (type) => {
const cards = type === 75 ? screwYouCards.seventyFive : screwYouCards.oneFifty;
const randomCard = cards[Math.floor(Math.random() * cards.length)];
setShowPopup(true);
setLoading(true);

// Animation delay before reveal
setTimeout(() => {
  setDrawnCard(randomCard);
  setLoading(false);
}, 1800);

};

return ( <div className="shop-container"> <header className="topBar">
<img src="../../Logo.png" alt="Logo" className="logo" onClick={() => handleNavigate('/')} style={{ cursor: 'pointer' }} /> <button className="menuButton" onClick={toggleMenu}>☰</button> </header>

```
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

  <div className="shop-content-wrapper main-content-padding">
    <div className="shop-header">
      <ShoppingCart className="shop-header-icon" />
      <h1 className="shop-title">SCREW YOU CARDS</h1>
    </div>

    <section>
      <p className="card-comments1">You can only hold one screw you card at once, and must play the card you have drawn before drawing another card.</p>
      <div className="btnDiv">
        <button className="drawBtn" onClick={() => handleDraw(75)}>Draw €75 Card</button>
        <button className="drawBtn" onClick={() => handleDraw(150)}>Draw €150 Card</button>
      </div>

      <h2 className="shop-subtitle">€75 Cards</h2>
      <div className="item-list">{screwYouCards.seventyFive.map((item) => <CardItem key={item.id} item={item} />)}</div>
    </section>

    <section style={{ marginTop: '2rem' }}>
      <h2 className="shop-subtitle">€150 Cards</h2>
      <div className="item-list">{screwYouCards.oneFifty.map((item) => <CardItem key={item.id} item={item} />)}</div>
    </section>
  </div>

  {showPopup && <Popup card={drawnCard} loading={loading} onClose={() => { setShowPopup(false); setDrawnCard(null); }} />}
</div>

);
};

export default ScrewYouCards;
