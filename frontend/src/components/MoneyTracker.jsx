import React, { useState } from 'react';
import './MoneyTracker.css';

const MoneyTracker = () => {
  const [balance, setBalance] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [adjustment, setAdjustment] = useState('');
  const [reason, setReason] = useState('delay/cancellations');

  const handleAdjustmentSubmit = (e) => {
    e.preventDefault();

    const amount = parseFloat(adjustment);
    if (isNaN(amount)) {
      alert('Please enter a valid number.');
      return;
    }

    setBalance(prev => prev + amount);
    setAdjustment('');
    setShowForm(false);
  };

  return (
    <div className='container'>
      <h2>Current Balance: €{balance.toFixed(2)}</h2>
      
      <button onClick={() => setShowForm(!showForm)} className='button'>
        Manual Adjustment
      </button>

      {showForm && (
        <form onSubmit={handleAdjustmentSubmit} className='form'>
          <label>
            Reason:
            <select 
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
              className='select'
            >
              <option value="delay/cancellations">Delay/Cancellations</option>
              <option value="tie break">Tie Break</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label>
            Adjustment Amount:
            <input
              type="number"
              value={adjustment}
              onChange={(e) => setAdjustment(e.target.value)}
              step="0.01"
              required
              className='input'
            />
          </label>

          <button type="submit" className='submit'>Apply Adjustment</button>
        </form>
      )}
    </div>
  );
};

export default MoneyTracker;