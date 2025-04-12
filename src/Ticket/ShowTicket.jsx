// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import "./ShowTicket.css";

// const ShowTickets = () => {
//   const { eventId } = useParams();
//   const [eventData, setEventData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedDomains, setSelectedDomains] = useState({});
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [quantities, setQuantities] = useState({});

//   // Fetch event and tickets data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/api/event-with-tickets/${eventId}`);
//         setEventData(response.data);
        
//         // Initialize selections and quantities
//         const initialSelections = {};
//         const initialQuantities = {};
//         let initialTotal = 0;
        
//         response.data.tickets.forEach(ticket => {
//           // Initialize quantity to 1 for each ticket
//           initialQuantities[ticket._id] = 1;
          
//           // For paid tickets with single domain, auto-select
//           if (ticket.ticketType === "paid" && ticket.domains.length === 1) {
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
      
//       // Update total amount based on quantity changes (only for paid tickets)
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

//   // Handle checkbox selection for domains (only for paid tickets)
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

//       // Calculate total amount considering quantities
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

//   // Handle payment
//   const handlePayment = () => {
//     const selectedDomainsList = Object.values(selectedDomains);
//     const selectedItems = selectedDomainsList.map(domain => ({
//       ...domain,
//       quantity: quantities[domain.ticketId] || 1
//     }));
    
//     alert(`Proceeding to payment for ${selectedItems.length} items. Total Amount: $${totalAmount}`);
//   };

//   // Handle registration for free tickets
//   const handleRegister = () => {
//     const selectedTickets = eventData.tickets.map(ticket => ({
//       ticketId: ticket._id,
//       ticketName: ticket.ticketName,
//       quantity: quantities[ticket._id] || 1
//     }));
    
//     alert(`You have successfully registered for the event with ${selectedTickets.length} ticket(s)`);
//   };

//   if (loading) {
//     return <div className="loading-message">Loading tickets...</div>;
//   }

//   if (error) {
//     return <div className="error-message">{error}</div>;
//   }

//   if (!eventData) {
//     return <div className="error-message">No event data found</div>;
//   }

//   return (
//     <div className="tickets-container">
//       <h2>{eventData.event.title}</h2>
      
//       {eventData.tickets.length === 0 ? (
//         <p>No tickets available for this event.</p>
//       ) : (
//         <div className="tickets-list">
//           {eventData.tickets.map((ticket) => (
//             <div key={ticket._id} className="ticket-card">
//               <h3>{ticket.ticketName}</h3>
//               <p>
//                 <strong>Type:</strong> {ticket.ticketType}
//               </p>
//               <p>
//                 <strong>Available:</strong> {ticket.quantity - ticket.sold} of {ticket.quantity}
//               </p>
//               <p>
//                 <strong>Description:</strong> {ticket.description}
//               </p>

//               {/* Show quantity selector for ALL event-type tickets (both paid and free) */}
//               {eventData.event.type === "event" && (
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

//               {/* Show domains only for paid tickets */}
//               {ticket.ticketType === "paid" && (
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
//                             {domain.domainName}: ${domain.price}
//                             {isSingleDomain && " (Required)"}
//                             {isSelected && eventData.event.type === "event" && (
//                               <span className="quantity-total">
//                                 × {quantities[ticket._id] || 1} = ${domain.price * (quantities[ticket._id] || 1)}
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

//       {eventData.tickets.some(ticket => ticket.ticketType === "paid") ? (
//         totalAmount > 0 && (
//           <div className="payment-section">
//             <h3>Total Amount to Pay: ${totalAmount}</h3>
//             <button onClick={handlePayment} className="payment-button">
//               Proceed to Payment
//             </button>
//           </div>
//         )
//       ) : (
//         <div className="register-section">
//           <button onClick={handleRegister} className="register-button">
//             Register for Event ({Object.values(quantities).reduce((sum, qty) => sum + qty, 0)} tickets)
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShowTickets;



import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./ShowTicket.css";
import Razorpay from "razorpay";

const ShowTickets = () => {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDomains, setSelectedDomains] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [orderId, setOrderId] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Fetch event and tickets data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/event-with-tickets/${eventId}`);
        setEventData(response.data);
        
        const initialSelections = {};
        const initialQuantities = {};
        let initialTotal = 0;
        
        response.data.tickets.forEach(ticket => {
          initialQuantities[ticket._id] = 1;
          
          if (ticket.ticketType === "paid" && ticket.domains.length === 1) {
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

  // Create Razorpay order
  const createRazorpayOrder = async () => {
    try {
      setPaymentLoading(true);
      const response = await axios.post('http://localhost:8080/api/create-razorpay-order', {
        amount: totalAmount * 100, // Convert to paise
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
      key: "rzp_test_LMyq9UIJlbV55M", // Your Razorpay Key ID
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      name: eventData.event.title,
      description: 'Ticket Purchase',
      order_id: orderId,
      handler: async function(response) {
        // Handle successful payment
        try {
          const verifyResponse = await axios.post('http://localhost:8080/api/verify-payment', {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            amount: totalAmount,
            eventId,
            tickets: Object.values(selectedDomains).map(domain => ({
              ticketId: domain.ticketId,
              domainName: domain.domainName,
              quantity: quantities[domain.ticketId] || 1
            }))
          });

          if (verifyResponse.data.success) {
            alert('Payment successful! Tickets booked.');
            // You might want to redirect to a success page or show tickets here
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
        name: 'User Name', // You can get this from user profile
        email: 'user@example.com', // You can get this from user profile
        contact: '9999999999' // You can get this from user profile
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
      const response = await axios.post('http://localhost:8080/api/register-free', {
        eventId,
        tickets: eventData.tickets.map(ticket => ({
          ticketId: ticket._id,
          quantity: quantities[ticket._id] || 1
        }))
      });

      if (response.data.success) {
        alert('Registration successful!');
        // Redirect or show success message
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration error. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading-message">Loading tickets...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!eventData) {
    return <div className="error-message">No event data found</div>;
  }

  return (
    <div className="tickets-container">
      <h2>{eventData.event.title}</h2>
      
      {eventData.tickets.length === 0 ? (
        <p>No tickets available for this event.</p>
      ) : (
        <div className="tickets-list">
          {eventData.tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card">
              <h3>{ticket.ticketName}</h3>
              <p>
                <strong>Type:</strong> {ticket.ticketType}
              </p>
              <p>
                <strong>Available:</strong> {ticket.quantity - ticket.sold} of {ticket.quantity}
              </p>
              <p>
                <strong>Description:</strong> {ticket.description}
              </p>

              {eventData.event.type === "event" && (
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

              {ticket.ticketType === "paid" && (
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

      {eventData.tickets.some(ticket => ticket.ticketType === "paid") ? (
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
        <div className="register-section">
          <button onClick={handleRegister} className="register-button">
            Register for Event ({Object.values(quantities).reduce((sum, qty) => sum + qty, 0)} tickets)
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowTickets;
