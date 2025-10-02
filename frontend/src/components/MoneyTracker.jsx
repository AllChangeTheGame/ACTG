import React, { useState, useEffect } from 'react';
import './MoneyTracker.css';
import { useAuth } from '../authentication/AuthContext';

const MoneyTracker = () => {
  const [balance, setBalance] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeductForm, setShowDeductForm] = useState(false);
  const [adjustment, setAdjustment] = useState('');
  const [reasonCategory, setReasonCategory] = useState('');
  const [reasonOptions, setReasonOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  // Fetch balance from API
  const fetchBalance = async () => {
    const token = await getToken();
    try {
      const res = await fetch('/api/wallet/balance', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const parsedBalance = parseFloat(data.balance);
      setBalance(!isNaN(parsedBalance) ? parsedBalance : 0);
    } catch (err) {
      console.error(err);
      setError('Could not load balance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [getToken]);

  // Fetch reason categories from API
  useEffect(() => {
    const fetchReasons = async () => {
      const token = await getToken();
      try {
        const res = await fetch('/api/wallet/reason-categories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReasonOptions(data);
        if (data.length > 0) setReasonCategory(data[0].value);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReasons();
  }, [getToken]);

  // Handle adjustments (Add or Deduct)
  const handleAdjustmentSubmit = async (e, isDeduct = false) => {
    e.preventDefault();

    const amount = parseFloat(adjustment);
    if (isNaN(amount)) {
      alert('Please enter a valid number');
      return;
    }

    const finalAmount = isDeduct ? -amount : amount;

    // Optimistically update local balance for instant feedback
    setBalance(prev => prev + finalAmount);

    const token = await getToken();
    const payload = {
      amount: finalAmount,
      reason_category: reasonCategory,
    };

    try {
      const res = await fetch('/api/wallet/transact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('API response error:', text);
        throw new Error('Failed to update balance');
      }

      // Refetch balance to ensure we are fully in sync
      await fetchBalance();

    } catch (err) {
      console.error('Error updating balance:', err);
      alert('Could not update balance');
      // Revert optimistic update if needed
      setBalance(prev => prev - finalAmount);
    }

    // Reset form
    setAdjustment('');
    setShowAddForm(false);
    setShowDeductForm(false);
  };

  return (
    <div className="moneyContainer">
      {loading ? (
        <h2 className="balance">Loading balance...</h2>
      ) : error ? (
        <h2 className="balance error">{error}</h2>
      ) : (
        <h2 className="balance">Current Balance: €{balance.toFixed(2)}</h2>
      )}

      <button onClick={() => setShowAddForm(!showAddForm)} className="button">Add</button>
      <button onClick={() => setShowDeductForm(!showDeductForm)} className="button">Deduct</button>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={(e) => handleAdjustmentSubmit(e, false)} className="form">
          <label>
            Reason:
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              className="select"
            >
              {reasonOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
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
              className="input"
            />
          </label>

          <button type="submit" className="submit">Apply Adjustment</button>
        </form>
      )}

      {/* Deduct Form */}
      {showDeductForm && (
        <form onSubmit={(e) => handleAdjustmentSubmit(e, true)} className="form">
          <label>
            Reason:
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              className="select"
            >
              {reasonOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
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
              className="input"
            />
          </label>

          <button type="submit" className="submit">Apply Adjustment</button>
        </form>
      )}
    </div>
  );
};

export default MoneyTracker;
