import React from 'react';
import './Shop.css'; // CSS for flipping and layout

const items = [
  {
    id: 1,
    name: 'Reveal the location of another pair',
    cost: '€25',
    description: 'Location shared for 30 minutes (other teams are not notified)',
  },
  {
    id: 2,
    name: 'Skip',
    cost: '€200',
    description: 'Leave without completing a challenge card',
  },
  {
    id: 3,
    name: 'Gain €100',
    cost: '200km',
    description: 'Lose 200km. Teams can have a negative total distance.',
  },
  {
    id: 4,
    name: '€75 Screw you',
    cost: '€75',
    description: 'A random draw from:<br><br>Slow one team<br>Slow both teams<br>Half reward<br>Double veto<br>Steal',
  },
  {
    id: 5,
    name: '€150 Screw you',
    cost: '€150',
    description: 'A random draw from:<br><br>Stop a team<br>Stop both teams<br>Reserve a route<br>Board the next available train<br>Eject',
  },
];

function Shop() {
  return (
    <div className="shop-container">
      <h2 className="shop-title">Shop</h2>
      <div className="shop-grid">
        {items.map((item) => (
          <div key={item.id} className="shop-card">
            <div className="shop-card-inner">
              <div className="shop-card-front">
                <h3>{item.name}</h3>
                <p dangerouslySetInnerHTML={{ __html: item.description }} />
              </div>
              <div className="shop-card-back">
                <p>{item.name}</p>
                <button className="buy-button">Purchase for {item.cost}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;
