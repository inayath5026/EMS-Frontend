import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Verify.css'; 

const Verify = () => {
  const { eventId } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/payments/${eventId}`);
        setPayments(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch payments');
        setLoading(false);
      }
    };
    const fetchUser = async () => {

      const userResponse = await fetch('http://localhost:8080/auth/current-user', {
        credentials: 'include'
      });
      const userData = await userResponse.json();
      setCurrentUser(userData.isAuthenticated ? userData.user.email : null);

    }
    fetchUser();
    fetchPayments();
  }, [eventId]);

  const handleStatusChange = async (paymentId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/payments/${paymentId}`, {
        status: newStatus
      });
      
      setPayments(payments.map(payment => 
        payment.payment_id === paymentId ? response.data.data : payment
      ));
    } catch (err) {
      console.error('Failed to update status:', err);
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'verified': return 'status-verified';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  if (!currentUser) return <div className="loading">Loading payments...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  if(currentUser != import.meta.env.VITE_ADMIN){
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to view this Page.</p>
        <Link to="/" className="home-link">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="verify-container">
      <h1>Payment Verification</h1>
      <h2>Event ID: {eventId}</h2>
      
      {payments.length === 0 ? (
        <p className="no-payments">No payments found for this event</p>
      ) : (
        <div className="table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Amount</th>
                <th>Payment ID</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.payment_id}>
                  <td>{payment.username}</td>
                  <td>&#x20B9; {payment.amount.toFixed(2)}</td>
                  <td>{payment.payment_id}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={payment.status}
                      onChange={(e) => handleStatusChange(payment.payment_id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Verify;