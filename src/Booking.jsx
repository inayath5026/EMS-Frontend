import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Booking.css';

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userResponse = await fetch('http://localhost:8080/auth/current-user', {
          credentials: 'include'
        });
        
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await userResponse.json();
        const holderName = userData.user.email;

        const bookingsResponse = await fetch(`http://localhost:8080/api/bookings?holderName=${encodeURIComponent(holderName)}`, {
          credentials: 'include'
        });

        if (!bookingsResponse.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatShortDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="no-bookings-container">
        <div className="empty-state">
          <svg className="ticket-icon" viewBox="0 0 24 24">
            <path d="M15,5V9H19V5H15M22,16V10C22,8.89 21.1,8 20,8H4A2,2 0 0,0 2,10V16A2,2 0 0,0 4,18H20A2,2 0 0,0 22,16M15,15V19H19V15H15M4,13H20V16H4V13Z" />
          </svg>
          <h2>No Bookings Yet</h2>
          <p>You don't have any upcoming events booked.</p>
          <button onClick={() => navigate('/events')} className="explore-events-button">
            Explore Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <h1 className="page-title">Your Tickets</h1>
      <div className="tickets-list">
        {bookings.map((booking) => (
          <div key={booking._id} className="ticket-card">
            <div className="ticket-header">
              <div className="event-date">
                <span className="date-day">{formatShortDate(booking.eventDate).split(' ')[1]}</span>
                <span className="date-month">{formatShortDate(booking.eventDate).split(' ')[0]}</span>
              </div>
              <div className="event-info">
                <h2 className="event-name">{booking.eventName}</h2>
                {/* <p className="event-time">
                  {new Date(booking.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p> */}
              </div>
            </div>
            
            <div className="ticket-body">
              {booking.eventBannerImage && (
                <div 
                  className="ticket-image"
                  style={{ backgroundImage: `url(${booking.eventBannerImage})` }}
                ></div>
              )}
              
              <div className="ticket-details">
                <div className="detail-row">
                  <span className="detail-label">Transaction ID</span>
                  <span className="detail-value">{booking.transactionId}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Booked On</span>
                  <span className="detail-value">{formatDate(booking.createdAt)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status</span>
                  <span className="detail-value status-confirmed">Confirmed</span>
                </div>
              </div>
            </div>
            
            <div className="ticket-footer">
              <div className="barcode">
                <div className="barcode-lines"></div>
                <div className="barcode-number">{booking._id.slice(0, 12)}</div>
              </div>
              {/* <button className="view-ticket-button" onClick={() => navigate(`/booking/${booking._id}`)}>
                View Ticket
              </button> */}
            </div>
            
            <div className="ticket-perforation"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Booking;