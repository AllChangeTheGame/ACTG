import React from 'react';
import MenuBar from '../components/MenuBar';
import './SpecialRules.css';

const cityChallengeModifiers = [
{ challenge: 'Fourth Challenge', multiple: '0.9' },
{ challenge: 'Fifth Challenge', multiple: '0.8' },
{ challenge: 'Sixth Challenge', multiple: '0.7' },
{ challenge: 'Seventh Challenge', multiple: '0.6' },
{ challenge: 'Eighth Challenge or More', multiple: '0.5' },
];

const SpecialRules = () => {

return ( 
  <div className="shop-container">
    <MenuBar />
  {/* --- MAIN CONTENT --- */}
  <div className="shop-content-wrapper main-content-padding">
    <div className="rules-header">
      <h1 className="rules-title"></h1>
    </div>

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
