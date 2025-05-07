// import React, { useState, useEffect } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// const Dashboard = () => {
//   const { eventId } = useParams();
//   const navigate = useNavigate();
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
//   const [ticketId, setTicketId] = useState("");
//   const [form, setForms] = useState(null);
//   const [formId, setFormId] = useState("");
//   const [currentUser, setCurrentUser] = useState("");
//   const [event, setEvent] = useState(null);

//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/api/tickets/${eventId}`
//         );
//         setTickets(response.data);
//         setTicketId(response.data[0]._id);
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.error || err.message);
//         setLoading(false);
//       }
//     };

//     const fetchForms = async () => {
//         try {
//           const response = await axios.get(`http://localhost:8080/api/events/${eventId}/forms`);
//           setForms(response.data.data[0]);
//           setFormId(response.data.data[0]._id)
//           setLoading(false);
//         } catch (err) {
//           setError(err.response?.data?.message || 'Failed to fetch forms');
//           setLoading(false);
//         }
//       };

//       const fetchEventAndUser = async () => {
//         try {
//           // Fetch current user with credentials
//           const userResponse = await fetch('http://localhost:8080/auth/current-user', {
//             credentials: 'include'
//           });
//           const userData = await userResponse.json();
//           setCurrentUser(userData.isAuthenticated ? userData.user.email : null);
  
//           // Fetch event
//           const eventResponse = await fetch(`http://localhost:8080/api/event/${eventId}`);
//           if (!eventResponse.ok) {
//             throw new Error("Event not found");
//           }
//           const eventData = await eventResponse.json();
//           setEvent(eventData);
//         } catch (error) {
//           console.error(error.message);
//         } finally {
//           setLoading(false);
//         }
//       };
  
//     fetchEventAndUser();
//     fetchForms();
//     fetchTickets();
//   }, [eventId]);

//   if (loading) return <div>Loading tickets...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (tickets.length === 0) return <div>No tickets found for this event</div>;

//   const handleDelete = async () => {
//     try {
//       const response = await fetch(`http://localhost:8080/api/event/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete the event");
//       }

//       navigate("/");
//     } catch (error) {
//       console.error("Error deleting event:", error);
//     }
//   };

//   const confirmDelete = () => {
//     setShowDeleteConfirmation(true);
//   };

//   const handleDeleteConfirmation = (confirmed) => {
//     if (confirmed) {
//       handleDelete();
//     }
//     setShowDeleteConfirmation(false);
//   };

//   if(currentUser != event?.createdBy){
//     return <>

//       <h2>Access Denied !</h2>

//     </>
//   } else {

//   return (
//     <div className="ticket-container">
//       <h2>{event.title}</h2>
//       <div className="ticket-list">
//         {tickets.map((ticket) => (
//           <div key={ticket._id} className="ticket-card">
//             <div className="ticket-stats">
//               <p>
//                 <strong>Available:</strong> {ticket.quantity}
//               </p>
//               <p>
//                 <strong>Sold:</strong> {ticket.sold}
//               </p>
//               <p>
//                 <strong>Remaining:</strong> {ticket.quantity - ticket.sold}
//               </p>
//             </div>
//           </div>
//         ))}
//         <button onClick={confirmDelete} className="delete-button">
//           Delete Event
//         </button>
//         <button
//           onClick={() => navigate("/edit/" + eventId)}
//           className="edit-button"
//         >
//           Edit Event
//         </button>
//         <button className="edit-button">
//           <Link to={`/edit-ticket/${ticketId}`}>
//             Edit Ticket
//           </Link>
//         </button>
//         <button className="edit-button">
//             <Link to={"/events/"+eventId+"/edit-form/"+formId}>ReCreate Form</Link>
//         </button>
//         <button className="edit-button">
//             <Link to={"/payments/"+eventId}>View Payments</Link>
//         </button>
//         <button className="edit-button">
//             <Link to={"/responses/"+eventId}>View Responses</Link>
//         </button>
//       </div>
//       {/* Delete Confirmation Pop-up */}
//       {showDeleteConfirmation && (
//         <div className="delete-confirmation-popup">
//           <div className="popup-content">
//             <h3>Are you sure you want to delete this event?</h3>
//             <p>This action cannot be undone.</p>
//             <div className="popup-buttons">
//               <button
//                 onClick={() => handleDeleteConfirmation(true)}
//                 className="confirm-button"
//               >
//                 Yes, Delete
//               </button>
//               <button
//                 onClick={() => handleDeleteConfirmation(false)}
//                 className="cancel-button"
//               >
//                 No, Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// }

// export default Dashboard;

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [form, setForms] = useState(null);
  const [formId, setFormId] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [userResponse, eventResponse, ticketsResponse, formsResponse] = await Promise.all([
          fetch('http://localhost:8080/auth/current-user', { credentials: 'include' }),
          fetch(`http://localhost:8080/api/event/${eventId}`),
          axios.get(`http://localhost:8080/api/tickets/${eventId}`),
          axios.get(`http://localhost:8080/api/events/${eventId}/forms`)
        ]);

        // Process user data
        const userData = await userResponse.json();
        const userEmail = userData.isAuthenticated ? userData.user.email : null;
        setCurrentUser(userEmail);

        // Process event data
        if (!eventResponse.ok) throw new Error("Event not found");
        const eventData = await eventResponse.json();
        setEvent(eventData);

        // Process tickets data
        setTickets(ticketsResponse.data);
        if (ticketsResponse.data.length > 0) {
          setTicketId(ticketsResponse.data[0]._id);
        }

        // Process forms data
        if (formsResponse.data.data && formsResponse.data.data.length > 0) {
          setForms(formsResponse.data.data[0]);
          setFormId(formsResponse.data.data[0]._id);
        }

        setAuthChecked(true);
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/event/${eventId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }

      navigate("/");
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event");
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmation = (confirmed) => {
    if (confirmed) {
      handleDelete();
    }
    setShowDeleteConfirmation(false);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading event data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (authChecked && (currentUser !== event?.createdBy && import.meta.env.VITE_ADMIN !== currentUser)) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to view this dashboard.</p>
        <Link to="/" className="home-link">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>{event?.title}</h1>
      </header>

      <div className="dashboard-content">
        <section className="tickets-section">
          <h2>Tickets Overview</h2>
          {tickets.length === 0 ? (
            <div className="no-tickets">
              <p>No tickets found for this event</p>
              <button 
                onClick={() => navigate(`/edit/${eventId}`)} 
                className="action-button create-ticket"
              >
                Create Tickets
              </button>
            </div>
          ) : (
            <div className="tickets-grid">
              {tickets.map((ticket) => (
                <div key={ticket._id} className="ticket-card">
                  <h3>{ticket.type}</h3>
                  <div className="ticket-stats">
                    <div className="stat-item">
                      <span className="stat-label">Available</span>
                      <span className="stat-value">{ticket.quantity}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Sold</span>
                      <span className="stat-value">{ticket.sold}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Remaining</span>
                      <span className="stat-value">{ticket.quantity - ticket.sold}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="actions-section">
          <h2>Event Management</h2>
          <div className="action-buttons">
            <button 
              onClick={() => navigate(`/edit/${eventId}`)} 
              className="action-button edit"
            >
              Edit Event Details
            </button>
            
            {tickets.length > 0 && (
              <button className="action-button edit">
                <Link to={`/edit-ticket/${ticketId}`}>
                  Edit Tickets
                </Link>
              </button>
            )}
            
            {formId ? (
              <button className="action-button form">
                <Link to={`/events/${eventId}/edit-form/${formId}`}>
                  Recreate Registration Form
                </Link>
              </button>
            ) : (
              <button className="action-button form">
                <Link to={`/events/${eventId}/create-form`}>
                  Create Registration Form
                </Link>
              </button>
            )}
            
            <button className="action-button payments">
              <Link to={`/payments/${eventId}`}>View Payments</Link>
            </button>
            
            <button className="action-button responses">
              <Link to={`/responses/${eventId}`}>View Responses</Link>
            </button>
            
            <button 
              onClick={confirmDelete} 
              className="action-button delete"
            >
              Delete Event
            </button>
          </div>
        </section>
      </div>

      {showDeleteConfirmation && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete "{event?.title}"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                onClick={() => handleDeleteConfirmation(true)}
                className="confirm-button"
              >
                Delete Event
              </button>
              <button
                onClick={() => handleDeleteConfirmation(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;