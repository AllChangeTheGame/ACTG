import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../authentication/firebase";
import { signOut } from "firebase/auth";
import './Guides.css';

const countryData = [
{ country: 'Austria', spirit: 'Marillenschnaps', breakfast: 'Kipferl', dish: 'Wiener Schnitzel', dessert: 'Apple Strudel' },
{ country: 'Belgium', spirit: 'Jenever', breakfast: 'Waffles', dish: 'Moules-Frites', dessert: 'Waffles' },
{ country: 'Croatia', spirit: 'Rakija', breakfast: 'Palačinke (pancakes)', dish: "black' risotto", dessert: 'Fritule (doughnuts)' },
{ country: 'Czech Republic', spirit: 'Becherovka', breakfast: 'Rye bread and meat', dish: 'Vepřo knedlo zelo (roast pork)', dessert: 'Buchty (sweet filled buns)' },
{ country: 'Denmark', spirit: 'Aquavit', breakfast: 'Danish Pastry', dish: 'Stegt flæsk (fried pork)', dessert: 'Danish pastry' },
{ country: 'France', spirit: 'Pastis', breakfast: 'Croissant', dish: 'Onion soup', dessert: 'Crème brûlée' },
{ country: 'Germany', spirit: 'Schnaps', breakfast: 'Non descript bread/meat', dish: 'Bratwurst', dessert: 'Gugelhupf (round cake)' },
{ country: 'Hungary', spirit: 'Unicum', breakfast: 'Lekváros bukta', dish: 'Goulash', dessert: 'Dobos torte (cake)' },
{ country: 'Italy', spirit: 'Sambuca', breakfast: 'Espresso', dish: 'Bolognese', dessert: 'Tiramisù' },
{ country: 'Netherlands', spirit: 'Gin', breakfast: 'Hagelslag', dish: 'Erwtensoep (pea soup)', dessert: 'Poffertjes (pancakes)' },
{ country: 'Poland', spirit: 'Vodka', breakfast: 'Kiełbasa', dish: 'Pierogi', dessert: 'Pączki (doughnuts)' },
{ country: 'Slovakia', spirit: 'Borovička', breakfast: 'Porridge', dish: 'Langoš (fried bread)', dessert: 'Bublanina (cake with fruit)' },
{ country: 'Slovenia', spirit: 'Zganje (schnapps)', breakfast: 'Fresh Bread + Honey', dish: 'Štruklji (rolled dumplings)', dessert: 'Potica (rolled dough Slovenian cake)' },
{ country: 'Spain', spirit: 'Pacharán', breakfast: 'Spanish Omelette', dish: 'Paella', dessert: 'Churros' },
{ country: 'Switzerland', spirit: 'Absinthe', breakfast: 'Cholermus/Local pancakes', dish: 'Fondue', dessert: 'Zwetgschenwähe (tart)' },
];

function Guides() {
const navigate = useNavigate();
const [menuOpen, setMenuOpen] = useState(false);
const [referenceOpen, setReferenceOpen] = useState(false);

useEffect(() => {
window.scrollTo(0, 0);
}, []);

const toggleMenu = () => setMenuOpen(!menuOpen);
const toggleReference = () => setReferenceOpen(!referenceOpen);
const handleNavigate = (path) => { setMenuOpen(false); navigate(path); };

  const handleLogout = () => {
    signOut(auth);
  };

return ( <div className="shop-container"> <header className="topBar">
<img
src="../../Logo.png"
alt="Logo"
className="logo"
onClick={() => handleNavigate("/")}
style={{ cursor: 'pointer' }}
/> <button className="menuButton" onClick={toggleMenu}>☰</button> </header>

```
  <div className={`slideMenu ${menuOpen ? "open" : ""}`}>
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

  <div className="main-content-padding national-page-content">
    <h2 className="national-title">National Cuisine Guide</h2>
    <div className="nationalTableWrapper">
      <table className="nationalTable">
        <thead>
          <tr>
            <th></th>
            <th>Spirit</th>
            <th>Breakfast</th>
            <th>Dish</th>
            <th>Dessert</th>
          </tr>
        </thead>
        <tbody>
          {countryData.map((c, i) => (
            <tr key={i}>
              <td>{c.country}</td>
              <td>{c.spirit}</td>
              <td>{c.breakfast}</td>
              <td>{c.dish}</td>
              <td>{c.dessert}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

);
}

export default Guides;
