// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axios from 'axios';
// import './RegistrationForm.css';

// const RegistrationForm = () => {
//   const { eventId } = useParams();
//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [startTime, setStartTime] = useState(null);
//   const [user, setUser] = useState("");
//   const [paymentVerified, setPaymentVerified] = useState(false);
//   const [paymentDetails, setPaymentDetails] = useState(null);
//   const [ticketType, setTicketType] = useState('paid');
//   const [hasExistingSubmission, setHasExistingSubmission] = useState(false);
//   const [existingSubmission, setExistingSubmission] = useState(null);

//   // Track when the form starts being filled
//   useEffect(() => {
//     setStartTime(new Date());
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // 1. Get current user
//         const userResponse = await fetch('http://localhost:8080/auth/current-user', {
//           credentials: 'include'
//         });
        
//         if (!userResponse.ok) {
//           throw new Error('Failed to fetch user data');
//         }
        
//         const userData = await userResponse.json();
//         setUser(userData.user?.email || "");

//         // 2. Check for existing submission
//         const submissionCheck = await axios.post(
//           'http://localhost:8080/api/check-submission',
//           {
//             eventId: eventId,
//             username: userData.user?.email
//           }
//         );

//         if (submissionCheck.data.exists) {
//           setHasExistingSubmission(true);
//           setExistingSubmission(submissionCheck.data.submission);
//           setIsLoading(false);
//           return;
//         }

//         // 3. Check ticket type for this event
//         const ticketResponse = await fetch(`http://localhost:8080/api/tickets/${eventId}`);
        
//         if (!ticketResponse.ok) {
//           throw new Error('Failed to fetch ticket data');
//         }
        
//         const tickets = await ticketResponse.json();
        
//         if (!tickets || tickets.length === 0) {
//           throw new Error('No tickets available for this event'); 
//         }
        
//         // Get the first ticket's type (assuming one ticket type per event)
//         const currentTicketType = tickets[0]?.ticketType || 'paid';
//         setTicketType(currentTicketType);

//         // 4. For paid tickets, verify payment status
//         if (currentTicketType === 'paid') {
//           const paymentStatusRes = await fetch(
//             "http://localhost:8080/api/verify-payment-status",
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               credentials: "include",
//               body: JSON.stringify({
//                 eventId: eventId,
//                 username: userData.user?.email
//               })
//             }
//           );

//           if (!paymentStatusRes.ok) {
//             throw new Error('Failed to verify payment status');
//           }

//           const paymentStatus = await paymentStatusRes.json();
          
//           if (!paymentStatus.success) {
//             setError('Payment not verified. Please complete payment first.');
//             setIsLoading(false);
//             return;
//           }
          
//           setPaymentVerified(true);
//           setPaymentDetails(paymentStatus.payment);
//         } else {
//           // For free tickets, skip payment verification
//           setPaymentVerified(true);
//           setPaymentDetails({
//             payment_id: 'free-event-no-payment',
//             amount: 0
//           });
//         }

//         // 5. Fetch the registration form
//         const formResponse = await axios.get(`http://localhost:8080/api/events/${eventId}/forms`);
        
//         if (formResponse.data.count > 0) {
//           setForm(formResponse.data.data[0]);
//           // Initialize form data
//           const initialFormData = {};
//           formResponse.data.data[0].questions.forEach(question => {
//             initialFormData[question._id] = 
//               question.fieldType === 'checkboxes' ? [] : '';
//           });
//           setFormData(initialFormData);
//         } else {
//           setError('No registration form found for this event');
//         }
        
//         setIsLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setIsLoading(false);
//         console.error('Registration form error:', err);
//       }
//     };

//     fetchData();
//   }, [eventId]);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = String(date.getFullYear()).slice(-2);
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
    
//     return `${day}-${month}-${year}, ${hours}:${minutes}`;
//   };

//   const handleInputChange = (questionId, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [questionId]: value
//     }));
//   };

//   const handleCheckboxChange = (questionId, optionValue, isChecked) => {
//     setFormData(prev => {
//       const currentValues = prev[questionId] || [];
//       return {
//         ...prev,
//         [questionId]: isChecked
//           ? [...currentValues, optionValue]
//           : currentValues.filter(val => val !== optionValue)
//       };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Calculate time taken in seconds
//       const endTime = new Date();
//       const duration = Math.round((endTime - startTime) / 1000);

//       // Prepare answers
//       const answers = form.questions.map(question => ({
//         questionId: question._id,
//         questionText: question.questionText,
//         fieldType: question.fieldType,
//         value: formData[question._id] || (question.fieldType === 'checkboxes' ? [] : '')
//       }));

//       // Prepare submission data
//       const submissionData = {
//         formId: form._id,
//         eventId: eventId,
//         submittedBy: user,
//         answers: answers,
//         metadata: {
//           duration: duration,
//           payment_id: paymentDetails?.payment_id || 'free-event'
//         }
//       };

//       await axios.post(
//         `http://localhost:8080/api/responses`,
//         submissionData,
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' }
//         }
//       );

//       setIsSubmitted(true);
//     } catch (err) {
//       setError('Submission failed: ' + (err.response?.data?.message || err.message));
//       console.error('Submission error:', err);
//     }
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Loading registration form...</p>
//       </div>
//     );
//   }

//   // Existing submission state
//   if (hasExistingSubmission) {
//     return (
//       <div className="submission-exists-container">
//         <div className="submission-exists-card">
//           <h2>Already Registered</h2>
//           <p>You've already submitted the registration form for this event.</p>
//           <div className="submission-details">
//             <p><strong>Submitted on:</strong> {formatDate(existingSubmission.createdAt)}</p>
//           </div>
//           <div className="button-group">
//             <Link to={`/events/${eventId}`} className="btn btn-primary">
//               View Event Details
//             </Link>
//             <Link to="/my-registrations" className="btn btn-secondary">
//               View My Registrations
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Success state after submission
//   if (isSubmitted) {
//     return (
//       <div className="success-container">
//         <div className="success-card">
//           <h2>🎉 Registration Successful!</h2>
//           <p>Thank you for registering for this event.</p>
          
//           {ticketType === 'paid' && paymentDetails && (
//             <div className="payment-details">
//               <p><strong>Payment ID:</strong> {paymentDetails.payment_id}</p>
//             </div>
//           )}
          
//           <Link to={`/events/${eventId}`} className="btn btn-primary">
//             View Event Details
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // Payment required state (for paid tickets only)
//   if (!paymentVerified && ticketType === 'paid') {
//     return (
//       <div className="payment-required-container">
//         <div className="payment-required-card">
//           <h2>Payment Required</h2>
//           <p>Please complete your payment before filling out the registration form.</p>
//           <div className="button-group">
//             <button>
//             <Link to={`/tickets/${eventId}`} className="btn btn-primary">
//               Proceed to Payment
//             </Link>
//             </button>
//             <button>
//             <Link to={`/event/${eventId}`} className="btn btn-secondary">
//               Back to Event
//             </Link>
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // No form available state
//   if (!form) {
//     return (
//       <div className="no-form-container">
//         <h2>No Registration Form</h2>
//         <p>This event doesn't have a registration form available.</p>
//         <Link to={`/event/${eventId}`} className="btn btn-primary">
//           Back to Event
//         </Link>
//       </div>
//     );
//   }

//   // Main form rendering
//   return (
//     <div className="registration-container">
//       <div className="registration-card">
//         <header className="form-header">
//           <h2>{form.title}</h2>
//           {form.description && (
//             <p className="form-description">{form.description}</p>
//           )}
//         </header>

//         {ticketType === 'paid' && paymentDetails && (
//           <div className="payment-badge">
//             <span>Payment Verified: ₹{paymentDetails.amount}</span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="registration-form">
//           {form.questions.map((question) => (
//             <div key={question._id} className={`form-group ${question.required ? 'required' : ''}`}>
//               <label htmlFor={`question-${question._id}`}>
//                 {question.questionText}
//                 {question.required && <span className="required-asterisk">*</span>}
//               </label>

//               {renderQuestionInput(question)}
//             </div>
//           ))}

//           <div className="form-actions">
//             <button type="submit" className="btn btn-submit">
//               Submit Registration
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );

//   // Helper function to render different input types
//   function renderQuestionInput(question) {
//     switch (question.fieldType) {
//       case 'short-answer':
//         return (
//           <input
//             type="text"
//             id={`question-${question._id}`}
//             value={formData[question._id] || ''}
//             onChange={(e) => handleInputChange(question._id, e.target.value)}
//             required={question.required}
//           />
//         );

//       case 'paragraph':
//         return (
//           <textarea
//             id={`question-${question._id}`}
//             value={formData[question._id] || ''}
//             onChange={(e) => handleInputChange(question._id, e.target.value)}
//             required={question.required}
//             rows={4}
//           />
//         );

//       case 'multiple-choice':
//         return (
//           <div className="options-group">
//             {question.options.map((option) => (
//               <div key={option.value} className="option-item">
//                 <input
//                   type="radio"
//                   id={`${question._id}-${option.value}`}
//                   name={question._id}
//                   value={option.value}
//                   checked={formData[question._id] === option.value}
//                   onChange={(e) => handleInputChange(question._id, e.target.value)}
//                   required={question.required && !formData[question._id]}
//                 />
//                 <label htmlFor={`${question._id}-${option.value}`}>
//                   {option.text}
//                 </label>
//               </div>
//             ))}
//           </div>
//         );

//       case 'checkboxes':
//         return (
//           <div className="options-group">
//             {question.options.map((option) => (
//               <div key={option.value} className="option-item">
//                 <input
//                   type="checkbox"
//                   id={`${question._id}-${option.value}`}
//                   value={option.value}
//                   checked={(formData[question._id] || []).includes(option.value)}
//                   onChange={(e) => handleCheckboxChange(
//                     question._id,
//                     option.value,
//                     e.target.checked
//                   )}
//                 />
//                 <label htmlFor={`${question._id}-${option.value}`}>
//                   {option.text}
//                 </label>
//               </div>
//             ))}
//           </div>
//         );

//       case 'dropdown':
//         return (
//           <select
//             id={`question-${question._id}`}
//             value={formData[question._id] || ''}
//             onChange={(e) => handleInputChange(question._id, e.target.value)}
//             required={question.required}
//           >
//             <option value="">Select an option</option>
//             {question.options.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.text}
//               </option>
//             ))}
//           </select>
//         );

//       default:
//         return <p>Unsupported question type</p>;
//     }
//   }
// };

// export default RegistrationForm;


import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './RegistrationForm.css';

const RegistrationForm = () => {
  const { eventId } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [user, setUser] = useState("");
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [ticketType, setTicketType] = useState('paid');
  const [hasExistingSubmission, setHasExistingSubmission] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [ticketsAvailable, setTicketsAvailable] = useState(true);

  // Track when the form starts being filled
  useEffect(() => {
    setStartTime(new Date());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get current user
        const userResponse = await fetch('http://localhost:8080/auth/current-user', {
          credentials: 'include'
        });
        
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await userResponse.json();
        setUser(userData.user?.email || "");

        // 2. Check for existing submission
        const submissionCheck = await axios.post(
          'http://localhost:8080/api/check-submission',
          {
            eventId: eventId,
            username: userData.user?.email
          }
        );

        if (submissionCheck.data.exists) {
          setHasExistingSubmission(true);
          setExistingSubmission(submissionCheck.data.submission);
          setIsLoading(false);
          return;
        }

        // 3. Check ticket availability for this event
        const ticketResponse = await fetch(`http://localhost:8080/api/tickets/${eventId}`);
        
        if (!ticketResponse.ok) {
          throw new Error('Failed to fetch ticket data');
        }
        
        const tickets = await ticketResponse.json();
        
        if (!tickets || tickets.length === 0) {
          throw new Error('No tickets available for this event'); 
        }
        
        // Check if all tickets are sold out
        const allSoldOut = tickets.every(ticket => ticket.quantity <= ticket.sold);
        if (allSoldOut) {
          setTicketsAvailable(false);
          setIsLoading(false);
          return;
        }

        // Get the first ticket's type (assuming one ticket type per event)
        const currentTicketType = tickets[0]?.ticketType || 'paid';
        setTicketType(currentTicketType);

        // 4. For paid tickets, verify payment status
        if (currentTicketType === 'paid') {
          const paymentStatusRes = await fetch(
            "http://localhost:8080/api/verify-payment-status",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                eventId: eventId,
                username: userData.user?.email
              })
            }
          );

          if (!paymentStatusRes.ok) {
            throw new Error('Failed to verify payment status');
          }

          const paymentStatus = await paymentStatusRes.json();
          
          if (!paymentStatus.success) {
            setError('Payment not verified. Please complete payment first.');
            setIsLoading(false);
            return;
          }
          
          setPaymentVerified(true);
          setPaymentDetails(paymentStatus.payment);
        } else {
          // For free tickets, skip payment verification
          setPaymentVerified(true);
          setPaymentDetails({
            payment_id: 'free-event-no-payment',
            amount: 0
          });
        }

        // 5. Fetch the registration form
        const formResponse = await axios.get(`http://localhost:8080/api/events/${eventId}/forms`);
        
        if (formResponse.data.count > 0) {
          setForm(formResponse.data.data[0]);
          // Initialize form data
          const initialFormData = {};
          formResponse.data.data[0].questions.forEach(question => {
            initialFormData[question._id] = 
              question.fieldType === 'checkboxes' ? [] : '';
          });
          setFormData(initialFormData);
        } else {
          setError('No registration form found for this event');
        }
        
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        console.error('Registration form error:', err);
      }
    };

    fetchData();
  }, [eventId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}-${month}-${year}, ${hours}:${minutes}`;
  };

  const handleInputChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleCheckboxChange = (questionId, optionValue, isChecked) => {
    setFormData(prev => {
      const currentValues = prev[questionId] || [];
      return {
        ...prev,
        [questionId]: isChecked
          ? [...currentValues, optionValue]
          : currentValues.filter(val => val !== optionValue)
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calculate time taken in seconds
      const endTime = new Date();
      const duration = Math.round((endTime - startTime) / 1000);

      // Prepare answers
      const answers = form.questions.map(question => ({
        questionId: question._id,
        questionText: question.questionText,
        fieldType: question.fieldType,
        value: formData[question._id] || (question.fieldType === 'checkboxes' ? [] : '')
      }));

      // Prepare submission data
      const submissionData = {
        formId: form._id,
        eventId: eventId,
        submittedBy: user,
        answers: answers,
        metadata: {
          duration: duration,
          payment_id: paymentDetails?.payment_id || 'free-event'
        }
      };

      await axios.post(
        `http://localhost:8080/api/responses`,
        submissionData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      setIsSubmitted(true);
    } catch (err) {
      setError('Submission failed: ' + (err.response?.data?.message || err.message));
      console.error('Submission error:', err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading registration form...</p>
      </div>
    );
  }

  // Error state
  // if (error) {
  //   return (
  //     <div className="error-container">
  //       <div className="error-card">
  //         <h2>Error</h2>
  //         <p>{error}</p>
  //         <Link to={`/event/${eventId}`} className="btn btn-primary">
  //           Back to Event
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  // Tickets sold out state
  if (!ticketsAvailable) {
    return (
      <div className="sold-out-container">
        <div className="sold-out-card">
          <h2>Registration Closed</h2>
          <p>All tickets for this event have been sold out.</p>
          <Link to={`/event/${eventId}`} className="btn btn-primary">
            <button>Back to Event</button>
          </Link>
        </div>
      </div>
    );
  }

  // Existing submission state
  if (hasExistingSubmission) {
    return (
      <div className="submission-exists-container">
        <div className="submission-exists-card">
          <h2>Already Registered</h2>
          <p>You've already submitted the registration form for this event.</p>
          <div className="submission-details">
            <p><strong>Submitted on:</strong> {formatDate(existingSubmission.createdAt)}</p>
          </div>
          <div className="button-group">
            <Link to={`/event/${eventId}`} className="btn btn-primary">
              <button>View Event Details</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state after submission
  if (isSubmitted) {
    return (
      <div className="success-container">
        <div className="success-card">
          <h2>🎉 Registration Successful!</h2>
          <p>Thank you for registering for this event.</p>
          
          {ticketType === 'paid' && paymentDetails && (
            <div className="payment-details">
              <p><strong>Payment ID:</strong> {paymentDetails.payment_id}</p>
            </div>
          )}
          
          <Link to={`/event/${eventId}`} className="btn btn-primary">
            <button>View Event Details</button>
          </Link>
        </div>
      </div>
    );
  }

  // Payment required state (for paid tickets only)
  if (!paymentVerified && ticketType === 'paid') {
    return (
      <div className="payment-required-container">
        <div className="payment-required-card">
          <h2>Payment Required</h2>
          <p>Please complete your payment before filling out the registration form.</p>
          <div className="button-group">
            <Link to={`/tickets/${eventId}`} className="btn btn-primary">
              <button>Proceed to Payment</button>
            </Link>
            <Link to={`/event/${eventId}`} className="btn btn-secondary">
              <button>Back to Event</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No form available state
  if (!form) {
    return (
      <div className="no-form-container">
        <h2>No Registration Form</h2>
        <p>This event doesn't have a registration form available.</p>
        <Link to={`/event/${eventId}`} className="btn btn-primary">
          Back to Event
        </Link>
      </div>
    );
  }

  // Main form rendering
  return (
    <div className="registration-container">
      <div className="registration-card">
        <header className="form-header">
          <h2>{form.title}</h2>
          {form.description && (
            <p className="form-description">{form.description}</p>
          )}
        </header>

        {ticketType === 'paid' && paymentDetails && (
          <div className="payment-badge">
            <span>Payment Verified: ₹{paymentDetails.amount}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          {form.questions.map((question) => (
            <div key={question._id} className={`form-group ${question.required ? 'required' : ''}`}>
              <label htmlFor={`question-${question._id}`}>
                {question.questionText}
                {question.required && <span className="required-asterisk">*</span>}
              </label>

              {renderQuestionInput(question)}
            </div>
          ))}

          <div className="form-actions">
            <button type="submit" className="btn btn-submit">
              Submit Registration
            </button>
            <button>
              <Link to={"/events/"+eventId+"/edit-form/"+form._id}>ReCreate Form</Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Helper function to render different input types
  function renderQuestionInput(question) {
    switch (question.fieldType) {
      case 'short-answer':
        return (
          <input
            type="text"
            id={`question-${question._id}`}
            value={formData[question._id] || ''}
            onChange={(e) => handleInputChange(question._id, e.target.value)}
            required={question.required}
          />
        );

      case 'paragraph':
        return (
          <textarea
            id={`question-${question._id}`}
            value={formData[question._id] || ''}
            onChange={(e) => handleInputChange(question._id, e.target.value)}
            required={question.required}
            rows={4}
          />
        );

      case 'multiple-choice':
        return (
          <div className="options-group">
            {question.options.map((option) => (
              <div key={option.value} className="option-item">
                <input
                  type="radio"
                  id={`${question._id}-${option.value}`}
                  name={question._id}
                  value={option.value}
                  checked={formData[question._id] === option.value}
                  onChange={(e) => handleInputChange(question._id, e.target.value)}
                  required={question.required && !formData[question._id]}
                />
                <label htmlFor={`${question._id}-${option.value}`}>
                  {option.text}
                </label>
              </div>
            ))}
          </div>
        );

      case 'checkboxes':
        return (
          <div className="options-group">
            {question.options.map((option) => (
              <div key={option.value} className="option-item">
                <input
                  type="checkbox"
                  id={`${question._id}-${option.value}`}
                  value={option.value}
                  checked={(formData[question._id] || []).includes(option.value)}
                  onChange={(e) => handleCheckboxChange(
                    question._id,
                    option.value,
                    e.target.checked
                  )}
                />
                <label htmlFor={`${question._id}-${option.value}`}>
                  {option.text}
                </label>
              </div>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <select
            id={`question-${question._id}`}
            value={formData[question._id] || ''}
            onChange={(e) => handleInputChange(question._id, e.target.value)}
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        );

      default:
        return <p>Unsupported question type</p>;
    }
  }
};

export default RegistrationForm;
