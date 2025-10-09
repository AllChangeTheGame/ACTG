import React from 'react';
import { Clock } from 'lucide-react';
import MenuBar from '../components/MenuBar';
import './Delays.css';

const TieBreaks = () => {

return ( 
  <div className="delay-container">
    <MenuBar />

  <div className="delay-content-wrapper main-content-padding">
    <div className="delay-header compact-header">
      <Clock className="delay-header-icon" />
      <h1 className="delay-title">TIE BREAKS</h1>
    </div>

    <section className="rules-section">
      <p className="combined-text">
        If two teams claim the same route within 10 minutes of each other, then the third team must draw a random challenge card (the ‘tie break challenge’), and the first of the two pairs to complete that card claims the route (If all three teams claim the same route within 10 minutes, then any random pair can draw the card). After this is resolved, any previously drawn challenge cards still remain active, the losing pair(s) does(/do) not also have to complete the ‘tie break challenge’.
      </p>
      <p className="combined-text">
        The losing pair(s) immediately receive(s) a refund of their travel to the city, can leave the city without completing a challenge card, and IF they do not claim the route they next travel on, they can travel for free, and receive an extra €150. The losing pair(s) can claim a route from the city, but they must pay for it as normal, and they do not receive the extra €150. The winning pair carries on as normal.
      </p>
      <p className="combined-text">
        <strong>If a team is travelling along a route that is claimed by another team, </strong>
        and if the team cannot return to their departure point within 60 minutes of their departure, they receive the same benefits as if they had made it to their destination, and lost in the situation above where the teams claim the same route. If they can return to their departure point within 60 minutes, and choose to do this then the train fare is refunded, but do not receive the other benefits. If they do not choose to do this, they will receive a refund but will not receive the other benefits.
      </p>
    </section>
  </div>
</div>

);
};

export default TieBreaks;
