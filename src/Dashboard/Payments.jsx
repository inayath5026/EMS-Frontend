// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import './Payments.css'; // We'll create this CSS file

// const Payments = () => {
//   const { eventId } = useParams();
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [stats, setStats] = useState({
//     totalAmount: 0,
//     completed: 0,
//     verifiedAmount: 0,
//     rejectedAmount: 0,
//   });

//   useEffect(() => {
//     const fetchPayments = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/api/payments/${eventId}`);
//         const data = await response.json();
        
//         if (!response.ok) {
//           throw new Error(data.message || 'Failed to fetch payments');
//         }
        
//         if (!data.success) {
//           setError(data.message);
//           setPayments([]);
//         } else {
//           setPayments(data.data);
//           calculateStats(data.data);
//         }
//       } catch (err) {
//         console.error('Error fetching payments:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const calculateStats = (payments) => {
//       const stats = {
//         totalAmount: 0,
//         completed: 0,
//         verifiedAmount: 0,
//         rejectedAmount: 0,
//       };

//       payments.forEach(payment => {
//         stats.totalAmount += payment.amount || 0;
//         if (payment._id) stats.completed++;
//         if (payment.status == 'verified') stats.verifiedAmount += payment.amount || 0;
//         if (payment.status == 'rejected') stats.rejectedAmount += payment.amount || 0;
//       });

//       setStats(stats);
//     };

//     fetchPayments();
//   }, [eventId]);

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Loading payments...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error-container">
//         <h2>Error</h2>
//         <p>{error}</p>
//         <p>Event ID: {eventId}</p>
//       </div>
//     );
//   }

//   if (payments.length === 0) {
//     return (
//       <div className="empty-container">
//         <h2>No Payments Found</h2>
//         <p>No payments were found for event ID: {eventId}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="payments-dashboard">
//       <header className="dashboard-header">
//         <h1>Payments for Event #{eventId}</h1>
//       </header>

//       <div className="stats-container">
//         <div className="stat-card">
//           <h3>Total Amount</h3>
//           <p className="stat-value">&#x20B9; {stats.totalAmount}</p>
//         </div>
//         <div className="stat-card">
//           <h3>Verified Amount</h3>
//           <p className="stat-value success">&#x20B9; {stats.verifiedAmount}</p>
//         </div>
//         <div className="stat-card">
//           <h3>Rejected Amount</h3>
//           <p className="stat-value danger">{stats.rejectedAmount}</p>
//         </div>
//         <div className="stat-card">
//           <h3>Total Payments</h3>
//           <p className="stat-value success">{stats.completed}</p>
//         </div>
//       </div>

//       <div className="payments-table-container">
//         <table className="payments-table">
//           <thead>
//             <tr>
//               <th>Payment ID</th>
//               <th>Amount</th>
//               <th>User</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {payments.map(payment => (
//               <tr key={payment._id} className={`status-${payment.status}`}>
//                 <td>{payment.payment_id}</td>
//                 <td>&#x20B9; {payment.amount}</td>
//                 <td>{payment.username || payment.userEmail || 'N/A'}</td>
//                 <td>{payment.status || 'N/A'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Payments;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Payments.css'; // We'll create this CSS file

const Payments = () => {
  const { eventId } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAmount: 0,
    completed: 0,
    verifiedAmount: 0,
    rejectedAmount: 0,
    verifiedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/payments/${eventId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch payments');
        }
        
        if (!data.success) {
          setError(data.message);
          setPayments([]);
        } else {
          setPayments(data.data);
          calculateStats(data.data);
        }
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const calculateStats = (payments) => {
      const stats = {
        totalAmount: 0,
        completed: 0,
        verifiedAmount: 0,
        rejectedAmount: 0,
        verifiedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
      };

      payments.forEach(payment => {
        stats.totalAmount += payment.amount || 0;
        if (payment._id) stats.completed++;
        
        if (payment.status === 'verified') {
          stats.verifiedAmount += payment.amount || 0;
          stats.verifiedCount++;
        } else if (payment.status === 'pending') {
          stats.pendingCount++;
        } else if (payment.status === 'rejected') {
          stats.rejectedAmount += payment.amount || 0;
          stats.rejectedCount++;
        }
      });

      setStats(stats);
    };

    fetchPayments();
  }, [eventId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <p>Event ID: {eventId}</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="empty-container">
        <h2>No Payments Found</h2>
        <p>No payments were found for event ID: {eventId}</p>
      </div>
    );
  }

  return (
    <div className="payments-dashboard">
      <header className="dashboard-header">
        <h1>Payments for Event #{eventId}</h1>
      </header>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Amount</h3>
          <p className="stat-value">&#x20B9; {stats.totalAmount}</p>
        </div>
        <div className="stat-card">
          <h3>Verified Amount</h3>
          <p className="stat-value success">&#x20B9; {stats.verifiedAmount}</p>
        </div>
        <div className="stat-card">
          <h3>Rejected Amount</h3>
          <p className="stat-value danger">&#x20B9; {stats.rejectedAmount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Payments</h3>
          <p className="stat-value">{stats.completed}</p>
        </div>
        <div className="stat-card">
          <h3>Payments Verified</h3>
          <p className="stat-value success">{stats.verifiedCount}</p>
        </div>
        <div className="stat-card">
          <h3>Payments Pending</h3>
          <p className="stat-value warning">{stats.pendingCount}</p>
        </div>
        <div className="stat-card">
          <h3>Rejected Payments</h3>
          <p className="stat-value danger">{stats.rejectedCount}</p>
        </div>
      </div>

      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Amount</th>
              <th>User</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment._id} className={`status-${payment.status}`}>
                <td>{payment.payment_id}</td>
                <td>&#x20B9; {payment.amount}</td>
                <td>{payment.username || payment.userEmail || 'N/A'}</td>
                <td>{payment.status || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;