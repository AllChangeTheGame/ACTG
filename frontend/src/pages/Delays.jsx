import React from 'react';
import { Clock } from 'lucide-react';
import MenuBar from '../components/MenuBar';
import './Delays.css';

const Delays = () => {

return ( 
  <div className="delay-container">
    <MenuBar />

  <div className="delay-content-wrapper main-content-padding">
    <div className="delay-header compact-header">
      <Clock className="delay-header-icon" />
      <h1 className="delay-title">DELAYS & CANCELLATIONS</h1>
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
