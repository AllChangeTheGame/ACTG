import React, { useState } from 'react';
import { ArrowRightLeft, TrendingUp } from 'lucide-react';
import MenuBar from '../components/MenuBar';
import './ForexRates.css';

const ForexRates = () => {
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('CHF');
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [rate, setRate] = useState(null);
  const [error, setError] = useState(null);

  const europeanCurrencies = ['EUR', 'CHF', 'DKK', 'PLN', 'CZK', 'HUF'];

  // Hardcoded exchange rates relative to EUR
  const forexRates = {
    EUR: 1,
    CHF: 0.93239788,
    DKK: 7.4674003,
    PLN: 4.2571373,
    CZK: 24.300345,
    HUF: 390.47876,
  };

  const handleConvert = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount.');
      setConverted(null);
      setRate(null);
      return;
    }

    setError(null);

    // Convert via EUR as base
    const amountInEUR = numericAmount / forexRates[fromCurrency];
    const convertedAmount = amountInEUR * forexRates[toCurrency];

    setRate(forexRates[toCurrency] / forexRates[fromCurrency]);
    setConverted(convertedAmount);
  };

  return (
    <div className="forex-container">
      <MenuBar />
      <div className="forex-content-wrapper main-content-padding">
        <div className="forex-header">
          <TrendingUp className="forex-header-icon" />
          <h1 className="forex-title">CURRENCY CONVERTER</h1>
        </div>

        <div className="forex-card">
          <div className="forex-inputs">
            <div className="forex-select-group">
              <label>From</label>
              <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                {europeanCurrencies.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </div>

            <ArrowRightLeft
                className="forex-arrow"
                size={24}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    setFromCurrency(toCurrency);
                    setToCurrency(fromCurrency);
                    // Optionally, reset converted value when swapping
                    setConverted(null);
                    setRate(null);
                }}
            />

            <div className="forex-select-group">
              <label>To</label>
              <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                {europeanCurrencies.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="forex-amount-section">
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
            />
          </div>

          <button className="forex-button button-primary" onClick={handleConvert}>
            Convert <ArrowRightLeft size={18} />
          </button>

          {error && <div className="forex-error">{error}</div>}

          {converted !== null && (
            <div className="forex-result">
              <p>
                {' '}
                <span className="forex-result-amount">{converted.toFixed(2)} {toCurrency}</span>
              </p>
              <p className="forex-rate-info">
                1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForexRates;
