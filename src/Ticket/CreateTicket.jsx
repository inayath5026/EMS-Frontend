// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./CreateTicket.css";

// const CreateTicket = () => {
//   const { id: eventId } = useParams(); // Extract eventId from the URL
//   const navigate = useNavigate();
//   const [ticketName, setTicketName] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [description, setDescription] = useState("");
//   const [ticketType, setTicketType] = useState("paid");
//   const [domains, setDomains] = useState([{ domainName: "", price: "" }]);

//   // Handle input changes for ticket fields
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "ticketName") setTicketName(value);
//     else if (name === "quantity") setQuantity((value));
//     else if (name === "description") setDescription(value);
//     else if (name === "ticketType") {
//       setTicketType(value);
//       // If ticket type is "free", set all domain prices to 0
//       if (value === "free") {
//         setDomains((prevDomains) =>
//           prevDomains.map((domain) => ({ ...domain, price: 0 }))
//         );
//       }
//     }
//   };

//   // Handle input changes for domain fields
//   const handleDomainChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedDomains = domains.map((domain, i) =>
//       i === index ? { ...domain, [name]: value } : domain
//     );
//     setDomains(updatedDomains);
//   };

//   // Add a new domain field
//   const addDomain = () => {
//     setDomains([...domains, { domainName: "", price: ticketType === "free" ? 0 : "" }]);
//   };

//   // Remove a domain field
//   const removeDomain = (index) => {
//     const updatedDomains = domains.filter((_, i) => i !== index);
//     setDomains(updatedDomains);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Convert empty price strings to 0 before submitting
//     const formattedDomains = domains.map((domain) => ({
//       ...domain,
//       price: domain.price === "" ? 0 : Number(domain.price),
//     }));

//     const ticketData = {
//       eventId, // Use the eventId from the URL
//       ticketName,
//       domains: formattedDomains,
//       quantity,
//       description,
//       ticketType,
//     };

//     try {
//       const response = await axios.post("http://localhost:8080/api/tickets", ticketData);
//       // Navigate to the registration form after ticket creation
//       navigate(`/create-form/${eventId}`);
      
//       // Reset form after submission
//       setTicketName("");
//       setQuantity(0);
//       setDescription("");
//       setTicketType("paid");
//       setDomains([{ domainName: "", price: "" }]);
//     } catch (error) {
//       console.error("Error creating ticket:", error);
//       alert("Failed to create ticket. Please try again.");
//     }
//   };

//   return (
//     <div className="create-ticket-container">
//       <h2>Create Ticket for Event ID: {eventId}</h2>
//       <form onSubmit={handleSubmit}>
//         {/* Ticket Name */}
//         <div className="form-group">
//           <label>Ticket Name</label>
//           <input
//             type="text"
//             name="ticketName"
//             value={ticketName}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         {/* Quantity */}
//         <div className="form-group">
//           <label>Quantity</label>
//           <input
//             type="number"
//             name="quantity"
//             value={quantity}
//             onChange={handleInputChange}
//             min="0"
//             required
//           />
//         </div>

//         {/* Description */}
//         <div className="form-group">
//           <label>Description</label>
//           <textarea
//             name="description"
//             value={description}
//             onChange={handleInputChange}
//           />
//         </div>

//         {/* Ticket Type */}
//         <div className="form-group">
//           <label>Ticket Type</label>
//           <select
//             name="ticketType"
//             value={ticketType}
//             onChange={handleInputChange}
//           >
//             <option value="paid">Paid</option>
//             <option value="free">Free</option>
//           </select>
//         </div>

//         {/* Domains - Conditionally render based on ticket type */}
//         {ticketType === "paid" && (
//           <div className="form-group">
//             <label>Domains</label>
//             {domains.map((domain, index) => (
//               <div key={index} className="domain-group">
//                 <input
//                   type="text"
//                   name="domainName"
//                   placeholder="Domain Name"
//                   value={domain.domainName}
//                   onChange={(e) => handleDomainChange(index, e)}
//                   required
//                 />
//                 <input
//                   type="number"
//                   name="price"
//                   placeholder="Price"
//                   value={domain.price === "" ? "" : domain.price}
//                   onChange={(e) => handleDomainChange(index, e)}
//                   min="0"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeDomain(index)}
//                   disabled={domains.length === 1}
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//             <button type="button" onClick={addDomain}>
//               Add Domain
//             </button>
//           </div>
//         )}

//         {/* Submit Button */}
//         <button type="submit">Create Ticket</button>
//       </form>
//     </div>
//   );
// };

// export default CreateTicket;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./CreateTicket.css";

const CreateTicket = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    ticketName: "",
    quantity: "",
    description: "",
    ticketType: "paid",
    domains: [{ domainName: "", price: "" }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: `/create-ticket/${eventId}` } });
    }
  }, [user, navigate, eventId]);

  // Handle input changes for ticket fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // If ticket type changed to free, set all prices to 0
      if (name === "ticketType" && value === "free") {
        newData.domains = newData.domains.map(domain => ({
          ...domain,
          price: 0
        }));
      }
      
      return newData;
    });
  };

  // Handle domain field changes
  const handleDomainChange = (index, e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newDomains = [...prev.domains];
      newDomains[index] = { 
        ...newDomains[index], 
        [name]: name === "price" ? (value === "" ? "" : Number(value)) : value 
      };
      
      return { ...prev, domains: newDomains };
    });
  };

  // Add new domain field
  const addDomain = () => {
    setFormData(prev => ({
      ...prev,
      domains: [
        ...prev.domains, 
        { 
          domainName: "", 
          price: prev.ticketType === "free" ? 0 : "" 
        }
      ]
    }));
  };

  // Remove domain field
  const removeDomain = (index) => {
    if (formData.domains.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      domains: prev.domains.filter((_, i) => i !== index)
    }));
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.ticketName.trim()) {
      setError("Ticket name is required");
      return false;
    }
    
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      setError("Quantity must be greater than 0");
      return false;
    }
    
    if (formData.ticketType === "paid") {
      for (const domain of formData.domains) {
        if (!domain.domainName.trim()) {
          setError("All domain names are required for paid tickets");
          return false;
        }
        if (domain.price === "" || Number(domain.price) < 0) {
          setError("All domain prices must be valid numbers");
          return false;
        }
      }
    }
    
    setError("");
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("Please login to create tickets");
      navigate('/login', { state: { from: `/create-ticket/${eventId}` } });
      return;
    }
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const ticketData = {
        eventId,
        ticketName: formData.ticketName,
        domains: formData.domains.map(domain => ({
          domainName: domain.domainName,
          price: domain.price === "" ? 0 : Number(domain.price)
        })),
        quantity: Number(formData.quantity),
        description: formData.description,
        ticketType: formData.ticketType,
        createdBy: user.email // Include creator's email
      };

      const response = await axios.post(
        "http://localhost:8080/api/tickets", 
        ticketData, 
        { withCredentials: true }
      );
      
      navigate(`/create-form/${eventId}`);
    } catch (error) {
      console.error("Ticket creation error:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
        navigate('/login', { state: { from: `/create-ticket/${eventId}` } });
      } else {
        setError(error.response?.data?.error || "Failed to create ticket. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="create-ticket-container">
      <h2>Create Ticket for Event</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ticket Name *</label>
          <input
            type="text"
            name="ticketName"
            value={formData.ticketName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Quantity *</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Ticket Type *</label>
          <select
            name="ticketType"
            value={formData.ticketType}
            onChange={handleInputChange}
            required
          >
            <option value="paid">Paid</option>
            <option value="free">Free</option>
          </select>
        </div>

        {formData.ticketType === "paid" && (
          <div className="form-group">
            <label>Domains *</label>
            {formData.domains.map((domain, index) => (
              <div key={index} className="domain-group">
                <input
                  type="text"
                  name="domainName"
                  placeholder="Domain Name"
                  value={domain.domainName}
                  onChange={(e) => handleDomainChange(index, e)}
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={domain.price}
                  onChange={(e) => handleDomainChange(index, e)}
                  min="0"
                  step="0.01"
                  required
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeDomain(index)}
                  disabled={formData.domains.length <= 1}
                >
                  ×
                </button>
              </div>
            ))}
            <button 
              type="button" 
              className="add-domain-btn"
              onClick={addDomain}
            >
              + Add Domain
            </button>
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;
