import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
import { auth } from "../authentication/firebase";
import { signOut } from "firebase/auth";
import './TransactionHistory.css';

function TransactionHistory() {
const { getToken } = useAuth();
const [transactions, setTransactions] = useState([]);
const [reasonMap, setReasonMap] = useState({});
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [menuOpen, setMenuOpen] = useState(false);
const [referenceOpen, setReferenceOpen] = useState(false);
const navigate = useNavigate();

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
const userRes = await fetch('/api/users/me', {
headers: { Authorization: `Bearer ${token}` },
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

const toggleMenu = () => setMenuOpen(!menuOpen);
const toggleReference = () => setReferenceOpen(!referenceOpen);

const handleNavigate = (path) => {
setMenuOpen(false);
navigate(path);
};

  const handleLogout = () => {
    signOut(auth);
  };

return ( <div className="shop-container"> <header className="topBar">
<img
src="../../Logo.png"
alt="Logo"
className="logo"
onClick={() => handleNavigate("/")}
style={{ cursor: 'pointer' }}
/> <button className="menuButton" onClick={toggleMenu}>
☰ </button> </header>

  <div className={`slideMenu ${menuOpen ? "open" : ""}`}>
    <button className="closeButton" onClick={toggleMenu}>
      ×
    </button>
    <h2>Menu</h2>
        <ul>
          <li><button onClick={() => navigate("/shop")}>Shop</button></li>
          <li><button onClick={() => navigate("/screwyoucards")}>Screw you cards</button></li>
          <li>
            <button onClick={toggleReference}>
              Reference {referenceOpen ? "▲" : "▼"}
            </button>
            {referenceOpen && (
              <ul className="submenu">
                <li><button onClick={() => navigate("/specialrules")}>Special rules</button></li>
                <li><button onClick={() => navigate("/transactions")}>Transaction history</button></li>
                <li><button onClick={() => navigate("/links")}>Useful links</button></li>
                <li><button onClick={() => navigate("/delays")}>Delays and cancellations</button></li>
                <li><button onClick={() => navigate("/guides")}>National cuisine guides</button></li>
              </ul>
        )}
      </li>
      <li><button onClick={handleLogout}><strong>Log out</strong></button></li>
    </ul>
  </div>

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
                <td>{reasonMap[txn.reason_category] || txn.reason_category}</td>
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
