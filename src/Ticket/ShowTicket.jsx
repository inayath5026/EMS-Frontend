// import React, { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./ShowTicket.css";

// const ShowTickets = () => {
//   const { eventId } = useParams();
//   const navigate = useNavigate();
//   const [eventData, setEventData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedDomains, setSelectedDomains] = useState({});
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [quantities, setQuantities] = useState({});
//   const [orderId, setOrderId] = useState(null);
//   const [user, setUser] = useState("");
//   const [userData, setUserData] = useState(null);
//   const [paymentLoading, setPaymentLoading] = useState(false);

//   // Fetch event and tickets data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/api/event-with-tickets/${eventId}`);
//         setEventData(response.data);

//         const userResponse = await fetch('http://localhost:8080/auth/current-user', {
//           credentials: 'include'
//         });
//         const userData = await userResponse.json();
//         setUser(userData.user.email);
//         setUserData(userData);
        
//         const initialSelections = {};
//         const initialQuantities = {};
//         let initialTotal = 0;
        
//         response.data.tickets.forEach(ticket => {
//           initialQuantities[ticket._id] = 1;
          
//           if (ticket.ticketType === "paid" && ticket.domains.length === 1 && ticket.quantity - ticket.sold > 0) {
//             const domain = ticket.domains[0];
//             const key = `${ticket._id}-${domain.domainName}`;
//             initialSelections[key] = {
//               ticketId: ticket._id,
//               domainName: domain.domainName,
//               price: domain.price
//             };
//             initialTotal += domain.price;
//           }
//         });
        
//         setSelectedDomains(initialSelections);
//         setTotalAmount(initialTotal);
//         setQuantities(initialQuantities);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError(err.response?.data?.error || "Failed to load event data");
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [eventId]);
 
//   // Check if all tickets are sold out
//   const allTicketsSoldOut = () => {
//     if (!eventData) return false;
//     return eventData.tickets.every(ticket => ticket.quantity - ticket.sold <= 0);
//   };

//   // Create Razorpay order
//   const createRazorpayOrder = async () => {
//     try {
//       setPaymentLoading(true);
//       const response = await axios.post('http://localhost:8080/api/create-razorpay-order', {
//         amount: totalAmount * 100,
//         currency: 'INR',
//         receipt: `order_${eventId}_${Date.now()}`
//       });
//       setOrderId(response.data.id);
//       return response.data.id;
//     } catch (error) {
//       console.error('Error creating order:', error);
//       alert('Failed to create payment order. Please try again.');
//       setPaymentLoading(false);
//       return null;
//     }
//   };

//   // Handle payment with Razorpay
//   const handlePayment = async () => {
//     const orderId = await createRazorpayOrder();
//     if (!orderId) return;

//     const options = {
//       key: "rzp_test_LMyq9UIJlbV55M",
//       amount: totalAmount * 100,
//       currency: 'INR',
//       name: eventData.event.title,
//       description: 'Ticket Purchase',
//       order_id: orderId,
//       handler: async function(response) {
//         try {
//           const verifyResponse = await axios.post(
//             'http://localhost:8080/api/verify-payment', 
//             {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//               amount: totalAmount,
//               user,
//               eventId,
//               tickets: Object.values(selectedDomains).map(domain => ({
//                 ticketId: domain.ticketId,
//                 domainName: domain.domainName,
//                 quantity: quantities[domain.ticketId] || 1
//               }))
//             },
//             { withCredentials: true }
//           );

//           if (verifyResponse.data.success) {
//             navigate(`/register/${eventId}`);
//           } else {
//             alert('Payment verification failed. Please contact support.');
//           }
//         } catch (error) {
//           console.error('Payment verification error:', error);
//           alert('Payment verification error. Please contact support.');
//         }
//         setPaymentLoading(false);
//       },
//       prefill: {
//         name: userData.user.name,
//         email: userData.user.email,
//         contact: '9999999999'
//       },
//       theme: {
//         color: '#3399cc'
//       }
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//     rzp.on('payment.failed', function(response) {
//       alert(`Payment failed: ${response.error.description}`);
//       setPaymentLoading(false);
//     });
//   };

//   // Handle quantity changes
//   const handleQuantityChange = (ticketId, change) => {
//     setQuantities(prev => {
//       const currentQuantity = prev[ticketId] || 1;
//       const ticket = eventData?.tickets.find(t => t._id === ticketId);
//       const availableQuantity = ticket ? ticket.quantity - ticket.sold : 1;
      
//       const newQuantity = Math.max(
//         1, 
//         Math.min(currentQuantity + change, availableQuantity)
//       );
      
//       let newTotal = 0;
//       Object.entries(selectedDomains).forEach(([key, domain]) => {
//         const domainTicketId = key.split('-')[0];
//         const quantity = domainTicketId === ticketId ? newQuantity : (prev[domainTicketId] || 1);
//         newTotal += domain.price * quantity;
//       });
//       setTotalAmount(newTotal);
      
//       return {
//         ...prev,
//         [ticketId]: newQuantity
//       };
//     });
//   };

//   // Handle domain selection
//   const handleDomainSelection = (ticketId, domainName, price, isSingleDomain) => {
//     if (isSingleDomain) return;

//     setSelectedDomains((prev) => {
//       const key = `${ticketId}-${domainName}`;
//       const updatedSelection = { ...prev };

//       if (updatedSelection[key]) {
//         delete updatedSelection[key];
//       } else {
//         updatedSelection[key] = { ticketId, domainName, price };
//       }

//       const total = Object.entries(updatedSelection).reduce(
//         (sum, [key, domain]) => {
//           const domainTicketId = key.split('-')[0];
//           const quantity = quantities[domainTicketId] || 1;
//           return sum + (domain.price * quantity);
//         }, 0
//       );
//       setTotalAmount(total);

//       return updatedSelection;
//     });
//   };

//   // Handle registration for free tickets
//   const handleRegister = async () => {
//     try {
//       await axios.post('http://localhost:8080/api/quantities', {
//         eventId,
//         username: user,
//         quantity: Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
//       });

//       const response = await axios.post('http://localhost:8080/api/register-free', {
//         eventId,
//         tickets: eventData.tickets.map(ticket => ({
//           ticketId: ticket._id,
//           quantity: quantities[ticket._id] || 1
//         }))
//       }, {
//         withCredentials: true
//       });

//       if (response.data.success) {
//         navigate(`/register/${eventId}`);
//       } else {
//         alert('Registration failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Registration error:', error);
//       alert('Registration error. Please try again.');
//     }
//   };

//   if (loading) return <div className="loading-message">Loading tickets...</div>;
//   if (error) return <div className="error-message">{error}</div>;
//   if (!eventData) return <div className="error-message">No event data found</div>;

//   return (
//     <div className="tickets-container">
//       <h2>{eventData.event.title}</h2>
      
//       {allTicketsSoldOut() ? (
//         <div className="sold-out-message">
//           <h3>Tickets Unavailable</h3>
//           <p>All tickets for this event have been sold out.</p>
//         </div>
//       ) : eventData.tickets.length === 0 ? (
//         <p>No tickets available for this event.</p>
//       ) : (
//         <div className="tickets-list">
//           {eventData.tickets.map((ticket) => (
//             <div 
//               key={ticket._id} 
//               className={`ticket-card ${ticket.quantity - ticket.sold <= 0 ? 'sold-out' : ''}`}
//             >
//               {ticket.quantity - ticket.sold <= 0 && (
//                 <div className="ticket-sold-out-banner">Sold Out</div>
//               )}
              
//               <h3>{ticket.ticketName}</h3>
//               <p>
//                 <strong>Type:</strong> {ticket.ticketType}
//                 {ticket.quantity - ticket.sold <= 0 && " (Unavailable)"}
//               </p>
//               <p>
//                 <strong>Available:</strong> {Math.max(0, ticket.quantity - ticket.sold)} of {ticket.quantity}
//               </p>
//               <p>
//                 <strong>Description:</strong> {ticket.description}
//               </p>

//               {eventData.event.type === "event" && ticket.quantity - ticket.sold > 0 && (
//                 <div className="quantity-selector">
//                   <label>Quantity:</label>
//                   <button 
//                     onClick={() => handleQuantityChange(ticket._id, -1)}
//                     disabled={quantities[ticket._id] <= 1}
//                   >
//                     -
//                   </button>
//                   <span>{quantities[ticket._id] || 1}</span>
//                   <button 
//                     onClick={() => handleQuantityChange(ticket._id, 1)}
//                     disabled={quantities[ticket._id] >= ticket.quantity - ticket.sold}
//                   >
//                     +
//                   </button>
//                 </div>
//               )}

//               {ticket.ticketType === "paid" && ticket.quantity - ticket.sold > 0 && (
//                 <>
//                   <h4>Domains:</h4>
//                   <ul className="domains-list">
//                     {ticket.domains.map((domain, index) => {
//                       const key = `${ticket._id}-${domain.domainName}`;
//                       const isSingleDomain = ticket.domains.length === 1;
//                       const isSelected = !!selectedDomains[key] || isSingleDomain;
                      
//                       if (isSingleDomain && !selectedDomains[key]) {
//                         setSelectedDomains(prev => ({
//                           ...prev,
//                           [key]: {
//                             ticketId: ticket._id,
//                             domainName: domain.domainName,
//                             price: domain.price
//                           }
//                         }));
//                         setTotalAmount(prev => prev + (domain.price * (quantities[ticket._id] || 1)));
//                       }

//                       return (
//                         <li key={index}>
//                           <label>
//                             <input
//                               type="checkbox"
//                               checked={isSelected}
//                               onChange={() =>
//                                 handleDomainSelection(
//                                   ticket._id, 
//                                   domain.domainName, 
//                                   domain.price,
//                                   isSingleDomain
//                                 )
//                               }
//                               disabled={isSingleDomain}
//                             />
//                             {domain.domainName}: ₹{domain.price}
//                             {isSingleDomain && " (Required)"}
//                             {isSelected && eventData.event.type === "event" && (
//                               <span className="quantity-total">
//                                 × {quantities[ticket._id] || 1} = ₹{domain.price * (quantities[ticket._id] || 1)}
//                               </span>
//                             )}
//                           </label>
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 </>
//               )}

//               <Link to={`/edit-ticket/${ticket._id}`} className="edit-button">
//                 Edit Ticket
//               </Link>
//             </div>
//           ))}
//         </div>
//       )}

//       {!allTicketsSoldOut() && (
//         eventData.tickets.some(ticket => ticket.ticketType === "paid") ? (
//           totalAmount > 0 && (
//             <div className="payment-section">
//               <h3>Total Amount to Pay: ₹{totalAmount}</h3>
//               <button 
//                 onClick={handlePayment} 
//                 className="payment-button"
//                 disabled={paymentLoading}
//               >
//                 {paymentLoading ? 'Processing...' : 'Proceed to Payment'}
//               </button>
//             </div>
//           )
//         ) : (
//           eventData.tickets.some(ticket => ticket.quantity - ticket.sold > 0) && (
//             <div className="register-section">
//               <button onClick={handleRegister} className="register-button">
//                 Register for Event ({Object.values(quantities).reduce((sum, qty) => sum + qty, 0)} tickets)
//               </button>
//             </div>
//           )
//         )
//       )}
//     </div>
//   );
// };

// export default ShowTickets;

import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ShowTicket.css";

const ShowTickets = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDomains, setSelectedDomains] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [orderId, setOrderId] = useState(null);
  const [user, setUser] = useState("");
  const [userData, setUserData] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Fetch event and tickets data and check registration status
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First get current user
        const userResponse = await fetch('http://localhost:8080/auth/current-user', {
          credentials: 'include'
        });
        const userData = await userResponse.json();
        setUser(userData.user.email);
        setUserData(userData);

        // Check if user is already registered
        const registrationCheck = await axios.post('http://localhost:8080/api/check-submission', {
          eventId,
          username: userData.user.email
        });

        if (registrationCheck.data.exists) {
          setIsRegistered(true);
          setLoading(false);
          return;
        }

        // If not registered, fetch event data
        const response = await axios.get(`http://localhost:8080/api/event-with-tickets/${eventId}`);
        setEventData(response.data);

        const initialSelections = {};
        const initialQuantities = {};
        let initialTotal = 0;
        
        response.data.tickets.forEach(ticket => {
          initialQuantities[ticket._id] = 1;
          
          if (ticket.ticketType === "paid" && ticket.domains.length === 1 && ticket.quantity - ticket.sold > 0) {
            const domain = ticket.domains[0];
            const key = `${ticket._id}-${domain.domainName}`;
            initialSelections[key] = {
              ticketId: ticket._id,
              domainName: domain.domainName,
              price: domain.price
            };
            initialTotal += domain.price;
          }
        });
        
        setSelectedDomains(initialSelections);
        setTotalAmount(initialTotal);
        setQuantities(initialQuantities);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.error || "Failed to load event data");
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  // Check if all tickets are sold out
  const allTicketsSoldOut = () => {
    if (!eventData) return false;
    return eventData.tickets.every(ticket => ticket.quantity - ticket.sold <= 0);
  };

  // Create Razorpay order
  const createRazorpayOrder = async () => {
    try {
      setPaymentLoading(true);
      const response = await axios.post('http://localhost:8080/api/create-razorpay-order', {
        amount: totalAmount * 100,
        currency: 'INR',
        receipt: `order_${eventId}_${Date.now()}`
      });
      setOrderId(response.data.id);
      return response.data.id;
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create payment order. Please try again.');
      setPaymentLoading(false);
      return null;
    }
  };

  // Handle payment with Razorpay
  const handlePayment = async () => {
    const orderId = await createRazorpayOrder();
    if (!orderId) return;

    const options = {
      key: "rzp_test_LMyq9UIJlbV55M",
      amount: totalAmount * 100,
      currency: 'INR',
      name: eventData.event.title,
      description: 'Ticket Purchase',
      order_id: orderId,
      handler: async function(response) {
        try {
          const verifyResponse = await axios.post(
            'http://localhost:8080/api/verify-payment', 
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: totalAmount,
              user,
              eventId,
              tickets: Object.values(selectedDomains).map(domain => ({
                ticketId: domain.ticketId,
                domainName: domain.domainName,
                quantity: quantities[domain.ticketId] || 1
              }))
            },
            { withCredentials: true }
          );

          if (verifyResponse.data.success) {
            navigate(`/register/${eventId}`);
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          alert('Payment verification error. Please contact support.');
        }
        setPaymentLoading(false);
      },
      prefill: {
        name: userData.user.name,
        email: userData.user.email,
        contact: '9999999999'
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    rzp.on('payment.failed', function(response) {
      alert(`Payment failed: ${response.error.description}`);
      setPaymentLoading(false);
    });
  };

  // Handle quantity changes
  const handleQuantityChange = (ticketId, change) => {
    setQuantities(prev => {
      const currentQuantity = prev[ticketId] || 1;
      const ticket = eventData?.tickets.find(t => t._id === ticketId);
      const availableQuantity = ticket ? ticket.quantity - ticket.sold : 1;
      
      const newQuantity = Math.max(
        1, 
        Math.min(currentQuantity + change, availableQuantity)
      );
      
      let newTotal = 0;
      Object.entries(selectedDomains).forEach(([key, domain]) => {
        const domainTicketId = key.split('-')[0];
        const quantity = domainTicketId === ticketId ? newQuantity : (prev[domainTicketId] || 1);
        newTotal += domain.price * quantity;
      });
      setTotalAmount(newTotal);
      
      return {
        ...prev,
        [ticketId]: newQuantity
      };
    });
  };

  // Handle domain selection
  const handleDomainSelection = (ticketId, domainName, price, isSingleDomain) => {
    if (isSingleDomain) return;

    setSelectedDomains((prev) => {
      const key = `${ticketId}-${domainName}`;
      const updatedSelection = { ...prev };

      if (updatedSelection[key]) {
        delete updatedSelection[key];
      } else {
        updatedSelection[key] = { ticketId, domainName, price };
      }

      const total = Object.entries(updatedSelection).reduce(
        (sum, [key, domain]) => {
          const domainTicketId = key.split('-')[0];
          const quantity = quantities[domainTicketId] || 1;
          return sum + (domain.price * quantity);
        }, 0
      );
      setTotalAmount(total);

      return updatedSelection;
    });
  };

  // Handle registration for free tickets
  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:8080/api/quantities', {
        eventId,
        username: user,
        quantity: Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
      });

      const response = await axios.post('http://localhost:8080/api/register-free', {
        eventId,
        tickets: eventData.tickets.map(ticket => ({
          ticketId: ticket._id,
          quantity: quantities[ticket._id] || 1
        }))
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        navigate(`/register/${eventId}`);
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration error. Please try again.');
    }
  };

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  
  if (isRegistered) {
    return (
      <div className="already-registered-container">
        <h2>Already Registered</h2>
        <p>You have already registered for this event using this email address.</p>
        <p>Please use a different email if you want to register again.</p>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    );
  }

  if (!eventData) return <div className="error-message">No event data found</div>;

  return (
    <div className="tickets-container">
      <h2>{eventData.event.title}</h2>
      
      {allTicketsSoldOut() ? (
        <div className="sold-out-message">
          <h3>Tickets Unavailable</h3>
          <p>All tickets for this event have been sold out.</p>
        </div>
      ) : eventData.tickets.length === 0 ? (
        <p>No tickets available for this event.</p>
      ) : (
        <div className="tickets-list">
          {eventData.tickets.map((ticket) => (
            <div 
              key={ticket._id} 
              className={`ticket-card ${ticket.quantity - ticket.sold <= 0 ? 'sold-out' : ''}`}
            >
              {ticket.quantity - ticket.sold <= 0 && (
                <div className="ticket-sold-out-banner">Sold Out</div>
              )}
              
              <h3>{ticket.ticketName}</h3>
              <p>
                <strong>Type:</strong> {ticket.ticketType}
                {ticket.quantity - ticket.sold <= 0 && " (Unavailable)"}
              </p>
              <p>
                <strong>Available:</strong> {Math.max(0, ticket.quantity - ticket.sold)} of {ticket.quantity}
              </p>
              <p>
                <strong>Description:</strong> {ticket.description}
              </p>

              {eventData.event.type === "event" && ticket.quantity - ticket.sold > 0 && (
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <button 
                    onClick={() => handleQuantityChange(ticket._id, -1)}
                    disabled={quantities[ticket._id] <= 1}
                  >
                    -
                  </button>
                  <span>{quantities[ticket._id] || 1}</span>
                  <button 
                    onClick={() => handleQuantityChange(ticket._id, 1)}
                    disabled={quantities[ticket._id] >= ticket.quantity - ticket.sold}
                  >
                    +
                  </button>
                </div>
              )}

              {ticket.ticketType === "paid" && ticket.quantity - ticket.sold > 0 && (
                <>
                  <h4>Domains:</h4>
                  <ul className="domains-list">
                    {ticket.domains.map((domain, index) => {
                      const key = `${ticket._id}-${domain.domainName}`;
                      const isSingleDomain = ticket.domains.length === 1;
                      const isSelected = !!selectedDomains[key] || isSingleDomain;
                      
                      if (isSingleDomain && !selectedDomains[key]) {
                        setSelectedDomains(prev => ({
                          ...prev,
                          [key]: {
                            ticketId: ticket._id,
                            domainName: domain.domainName,
                            price: domain.price
                          }
                        }));
                        setTotalAmount(prev => prev + (domain.price * (quantities[ticket._id] || 1)));
                      }

                      return (
                        <li key={index}>
                          <label>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                handleDomainSelection(
                                  ticket._id, 
                                  domain.domainName, 
                                  domain.price,
                                  isSingleDomain
                                )
                              }
                              disabled={isSingleDomain}
                            />
                            {domain.domainName}: ₹{domain.price}
                            {isSingleDomain && " (Required)"}
                            {isSelected && eventData.event.type === "event" && (
                              <span className="quantity-total">
                                × {quantities[ticket._id] || 1} = ₹{domain.price * (quantities[ticket._id] || 1)}
                              </span>
                            )}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              <Link to={`/edit-ticket/${ticket._id}`} className="edit-button">
                Edit Ticket
              </Link>
            </div>
          ))}
        </div>
      )}

      {!allTicketsSoldOut() && (
        eventData.tickets.some(ticket => ticket.ticketType === "paid") ? (
          totalAmount > 0 && (
            <div className="payment-section">
              <h3>Total Amount to Pay: ₹{totalAmount}</h3>
              <button 
                onClick={handlePayment} 
                className="payment-button"
                disabled={paymentLoading}
              >
                {paymentLoading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          )
        ) : (
          eventData.tickets.some(ticket => ticket.quantity - ticket.sold > 0) && (
            <div className="register-section">
              <button onClick={handleRegister} className="register-button">
                Register for Event ({Object.values(quantities).reduce((sum, qty) => sum + qty, 0)} tickets)
              </button>
            </div>
          )
        )
      )}
    </div>
  );
};

export default ShowTickets;