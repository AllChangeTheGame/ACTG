// Shop.jsx
import React, { useState } from 'react';
import { ShoppingCart, Compass, Zap, SkipForward, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MenuBar from '../components/MenuBar';
import Modal from '../components/Modal';
import LocationSharingForm from '../components/LocationSharingForm';
import './Shop.css';

const shopItems = [
  {
    id: 'reveal_pair',
    name: 'Reveal Opponent Location',
    cost: '€25',
    icon: Compass,
    comments: 'Location shared for 30 minutes. This may be played at any point after being purchased, and multiple may be used at the same time (other teams are not notified). Mark purchase via money tracker on the homepage. Activate below at the desired time.',
    button: 'Activate'
  },
  {
    id: 'skip',
    name: 'Leave Without Completing Challenge (‘Skip’)',
    cost: '€200',
    icon: SkipForward,
    comments: 'Purchased and held in inventory. Can be used in a future city instead of completing a challenge card. Can cancel an active card without serving a veto period. When using this ability whilst travelling, the train must stop in the city that is being skipped. Mark purchase via money tracker on the homepage'
  },
  {
    id: 'gain_money',
    name: 'Gain €100 (Distance Exchange)',
    cost: '-200km',
    icon: TrendingUp,
    comments: 'Exchanging 200 km (distance penalty) for €100. Teams can accumulate a negative total distance. Activate below at the desired time.',
    button: 'Activate'
  },
  {
    id: 'screw_you',
    name: 'Buy a Screw You Card',
    cost: '€75 / €150',
    icon: Zap,
    comments: 'Cards to negatively impact other teams. You can only hold one screw you card at once, and must play the card you have drawn before drawing another card. The €75 cards cause moderate impact whereas the €150 cards cause severe impact.',
    button: 'Read more'
  },
];

const ShopItem = ({ item }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const Icon = item.icon;
  const isDistanceExchange = item.cost.includes('km');

  const handleButtonClick = () => {
    if (item.id === 'screw_you') {
      navigate('/screwyoucards');
    } else if (item.id === 'reveal_pair') {
      setIsModalOpen(true);
    } else {
      // Placeholder action for other buttons like 'Activate'
      console.log(`Action button for ${item.name} clicked`);
    }
  };

  return (
    <>
      <div className="item-card">
        <div className="card-header">
          <div className="card-info">
            <div className={`icon-wrapper ${isDistanceExchange ? 'icon-penalty' : 'icon-primary'}`}>
              <Icon className="icon-main" />
            </div>
            <h3 className="card-name">{item.name}</h3>
          </div>
          <div className="card-cost-wrapper">
            <div className={`card-cost ${isDistanceExchange ? 'cost-penalty' : 'cost-normal'}`}>
              {item.cost}
            </div>
            <span className="cost-label">Cost/Exchange</span>
          </div>
        </div>
        
        <p className="card-comments">{item.comments}</p>

        {item.button && (
          <button 
            className={`item-button ${item.id === 'screw_you' ? 'button-secondary' : 'button-primary'}`}
            onClick={handleButtonClick}
          >
            {item.button} <ArrowRight size={18} />
          </button>
        )}
      </div>

      {item.id === 'reveal_pair' && isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <LocationSharingForm onTracked={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </>
  );
};

const Shop = () => {
  // Ensure there's a modal-root div in the DOM
  if (!document.getElementById('modal-root')) {
    const modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  }

  return (
    <div className="shop-container">
      <MenuBar />
      <div className="shop-content-wrapper main-content-padding">
        <div className="shop-header">
          <ShoppingCart className="shop-header-icon" />
          <h1 className="shop-title">SHOP ITEMS</h1>
        </div>
        <div className="item-list">
          {shopItems.map(item => (
            <ShopItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
