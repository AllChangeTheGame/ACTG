/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './MoneyTracker.css';
import { useAuth } from '../authentication/AuthContext';
import ReactDOM from 'react-dom';

const Modal = ({ children, onClose }) => {
  const modalRoot = document.getElementById('modal-root'); 
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="modalClose" onClick={onClose}>✖</button>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

const MoneyTracker = () => {
  const [balance, setBalance] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeductForm, setShowDeductForm] = useState(false);
  const [adjustment, setAdjustment] = useState('');
  const [reasonCategory, setReasonCategory] = useState('');
  const [reasonOptions, setReasonOptions] = useState([]);
  const [customReason, setCustomReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();
  
  const [isDeductionTooLarge, setIsDeductionTooLarge] = useState(false);

  // Fetch balance
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

  // Fetch reason categories
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

  const addReasons = reasonOptions.filter(r => r.type === 'add' || r.type === 'both');
  const deductReasons = reasonOptions.filter(r => r.type === 'deduct' || r.type === 'both');

  // Include 'steal' in deduct options if missing
  const finalDeductReasons = [...deductReasons];
  if (!finalDeductReasons.some(opt => opt.value === 'steal')) {
    finalDeductReasons.push({ value: 'steal', label: 'Steal', type: 'deduct' });
  }

  // Auto-populate adjustment for certain categories
  useEffect(() => {
    if (reasonCategory === 'new_country' || reasonCategory === 'new_capital') {
      setAdjustment('25');
    } else if (reasonCategory === 'steal') {
      setAdjustment('50');
    } else {
      setAdjustment('');
    }
  }, [reasonCategory]);

  // Client-side validation for deductions
  useEffect(() => {
    if (showDeductForm) {
      const amount = parseFloat(adjustment);
      const isStealing = reasonCategory === 'steal';
      setIsDeductionTooLarge(!isNaN(amount) && !isStealing && amount > balance);
    }
  }, [adjustment, balance, reasonCategory, showDeductForm]);

  const handleAdjustmentSubmit = async (e, isDeduct = false) => {
    e.preventDefault();
    const amount = parseFloat(adjustment);
    if (isNaN(amount) || amount <= 0) { 
      alert('Please enter a valid positive number');
      return;
    }

    const finalAmount = isDeduct ? -amount : amount;
    const newBalance = balance + finalAmount;
    const isStealing = reasonCategory === 'steal';

    if (isDeduct && newBalance < 0 && !isStealing) {
      alert('Cannot deduct this amount. Insufficient funds.');
      return;
    }

    // Optimistic UI update
    setBalance(prev => prev + finalAmount);

    const token = await getToken();
    const payload = {
      amount: finalAmount,
      reason_category: reasonCategory,
      reason: reasonCategory === 'other' || reasonCategory === 'challenge_card' ? customReason : null,
    };

    console.log('API Payload:', payload);

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
      await fetchBalance();
    } catch (err) {
      console.error('Error updating balance:', err);
      alert('Could not update balance.');
      setBalance(prev => prev - finalAmount); // revert optimistic update
    }

    setAdjustment('');
    setCustomReason('');
    setShowAddForm(false);
    setShowDeductForm(false);
  };

  const isDeductSubmitDisabled = isDeductionTooLarge && reasonCategory !== 'steal';
  const readOnlyAmount = ['new_country','new_capital','steal'].includes(reasonCategory);

  return (
    <div className="moneyContainer">
      {loading ? (
        <h2 className="balance">Loading balance...</h2>
      ) : error ? (
        <h2 className="balance error">{error}</h2>
      ) : (
        <h2 className="balance">Balance: €{balance.toFixed(2)}</h2>
      )}

      <div className="buttonRow">
        <button onClick={() => setShowAddForm(true)} className="button addBtn">Add</button>
        <button onClick={() => setShowDeductForm(true)} className="button deductBtn">Deduct</button>
      </div>

      {showAddForm && (
        <Modal onClose={() => setShowAddForm(false)}>
          <form onSubmit={(e) => handleAdjustmentSubmit(e, false)} className="form">
            <h3>Add Funds</h3>
            <label className="formLabel">
              Reason
              <select
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value)}
                className="select"
              >
                {addReasons.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))} 
                {!addReasons.some(opt => opt.value === 'other') && <option value="other">Other</option>}
              </select>
            </label>

            {reasonCategory === 'other' && (
              <label className="formLabel">
                Enter Reason
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  required
                  className="input"
                />
              </label>
            )}

            <label className="formLabel">
              Amount
              <input
                type="number"
                value={adjustment}
                onChange={(e) => setAdjustment(e.target.value)}
                step="0.01"
                min="0"
                required
                className={`input ${readOnlyAmount ? 'readonly' : ''}`}
                readOnly={readOnlyAmount}
              />
            </label>

            <button type="submit" className="submit">Apply</button>
            <a href="/specialrules2" className="specialRulesLink">Challenge card multipliers</a>
          </form>
        </Modal>
      )}

      {showDeductForm && (
        <Modal onClose={() => setShowDeductForm(false)}>
          <form onSubmit={(e) => handleAdjustmentSubmit(e, true)} className="form">
            <h3>Deduct Funds</h3>
            <label className="formLabel">
              Reason
              <select
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value)}
                className="select"
              >
                {finalDeductReasons.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))} 
                {!finalDeductReasons.some(opt => opt.value === 'other') && <option value="other">Other</option>}
              </select>
            </label>

            {reasonCategory === 'other' && (
              <label className="formLabel">
                Enter Reason
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  required
                  className="input"
                />
              </label>
            )}

            <label className="formLabel">
              Amount
              <input
                type="number"
                value={adjustment}
                onChange={(e) => setAdjustment(e.target.value)}
                step="0.01"
                min="0"
                required
                className={`input ${readOnlyAmount ? 'readonly' : ''}`}
                readOnly={readOnlyAmount}
              />
            </label>

            {isDeductionTooLarge && reasonCategory !== 'steal' && (
              <p style={{ color: 'red', marginTop: '10px' }}>
                ❌ This deduction exceeds the current balance.
              </p>
            )}

            <button type="submit" className="submit" disabled={isDeductSubmitDisabled}>Apply</button>
            <a href="/specialrules" className="specialRulesLink">France, Germany and Free Route special rules</a>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MoneyTracker;
