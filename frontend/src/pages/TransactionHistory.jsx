import React, { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext';
import MenuBar from '../components/MenuBar';
import './TransactionHistory.css';

function TransactionHistory() {
const { getToken } = useAuth();
const [transactions, setTransactions] = useState([]);
const [reasonMap, setReasonMap] = useState({});
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
window.scrollTo(0, 0);
}, []);

// Fetch reason categories
useEffect(() => {
const fetchReasons = async () => {
try {
const token = await getToken();
const res = await fetch('/api/wallet/reason-categories', {
headers: { Authorization: `Bearer ${token}` },
});
const data = await res.json();
const map = {};
data.forEach(r => (map[r.value] = r.label));
setReasonMap(map);
} catch (err) {
console.error('Failed to fetch reason categories:', err);
}
};
fetchReasons();
}, [getToken]);

// Fetch transactions
useEffect(() => {
const fetchTransactions = async () => {
setLoading(true);
try {
const token = await getToken();
const userRes = await fetch('/api/users/me/', {
headers: { Authorization: `Bearer ${token}` },
redirect: 'manual'
});
const userData = await userRes.json();
const teamId = userData.team_id;

    const txnRes = await fetch(`/api/wallet/transactions?team_id=${teamId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const txnData = await txnRes.json();

    const sortedTxns = txnData.sort(
      (a, b) => new Date(b.create_time) - new Date(a.create_time)
    );

    setTransactions(sortedTxns);
  } catch (err) {
    console.error(err);
    setError('Could not load transactions');
  } finally {
    setLoading(false);
  }
};
fetchTransactions();

}, [getToken]);

const formatDate = (isoString) => {
const date = new Date(isoString);
return date.toLocaleString();
};

return (
  <div className="shop-container">
    <MenuBar />
    <div className="main-content-padding transaction-page-content">
      <h2 className="transaction-title">Transaction History</h2>

    {loading && <p className="transaction-status">Loading transactions...</p>}
    {error && <p className="transaction-error">{error}</p>}
    {!loading && !error && transactions.length === 0 && (
      <p className="transaction-status">No transactions found.</p>
    )}

    {!loading && !error && transactions.length > 0 && (
      <div className="transactionTableWrapper">
        <table className="transactionTable">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Amount (€)</th>
              <th>Reason</th>
              <th>Balance After (€)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(txn => (
              <tr key={txn.id}>
                <td>{formatDate(txn.create_time)}</td>
                <td className={parseFloat(txn.amount) < 0 ? 'negative' : 'positive'}>
                  {parseFloat(txn.amount).toFixed(2)}
                </td>
                <td>
                  {txn.reason_category === 'other'
                    ? txn.reason || 'Other'
                    : reasonMap[txn.reason_category] || txn.reason_category}
                </td>
                <td>{parseFloat(txn.wallet_balance_after).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>

);
}

export default TransactionHistory;
