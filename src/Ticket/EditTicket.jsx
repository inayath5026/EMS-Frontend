import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateTicket.css"; // Import the CSS file

const EditTicket = () => {
  const { ticketId } = useParams(); // Extract ticketId from the URL
  const navigate = useNavigate(); // For navigation after submission
  const [ticketName, setTicketName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState("");
  const [ticketType, setTicketType] = useState("paid");
  const [domains, setDomains] = useState([{ domainName: "", price: "" }]);
  const [eventId, setEventId] = useState("");

  // Fetch ticket data when the component mounts
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/ticket/${ticketId}`);
        const ticketData = response.data; // Extract the ticket data
        setEventId(ticketData.eventId);

        // Ensure domains is always an array, even if it's undefined or null in the response
        const fetchedDomains = ticketData.domains || [{ domainName: "", price: "" }];

        // Set the state with fetched data
        setTicketName(ticketData.ticketName || "");
        setQuantity(ticketData.quantity || 0);
        setDescription(ticketData.description || "");
        setTicketType(ticketData.ticketType || "paid");
        setDomains(fetchedDomains); // Set domains with fetched data or default value

      } catch (error) {
        console.error("Error fetching ticket data:", error);
        alert("Failed to fetch ticket data. Please try again.");
      }
    };

    fetchTicketData();
  }, [ticketId]);

  // Handle input changes for ticket fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "ticketName") setTicketName(value);
    else if (name === "quantity") setQuantity(Number(value));
    else if (name === "description") setDescription(value);
    else if (name === "ticketType") setTicketType(value);
  };

  // Handle input changes for domain fields
  const handleDomainChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDomains = domains.map((domain, i) =>
      i === index ? { ...domain, [name]: value } : domain
    );
    setDomains(updatedDomains);
  };

  // Add a new domain field
  const addDomain = () => {
    setDomains([...domains, { domainName: "", price: "" }]);
  };

  // Remove a domain field
  const removeDomain = (index) => {
    const updatedDomains = domains.filter((_, i) => i !== index);
    setDomains(updatedDomains);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert empty price strings to 0 before submitting
    const formattedDomains = domains.map((domain) => ({
      ...domain,
      price: domain.price === "" ? 0 : Number(domain.price),
    }));

    const ticketData = {
      ticketName,
      domains: formattedDomains,
      quantity,
      description,
      ticketType,
    };

    try {
      const response = await axios.put(`http://localhost:8080/api/tickets/${ticketId}`, ticketData);
      navigate("/tickets/"+eventId); // Extract eventId using ticketId
    } catch (error) {
      console.error("Error updating ticket:", error);
      alert("Failed to update ticket. Please try again.");
    }
  };

  return (
    <div className="create-ticket-container">
      <h2>Edit Ticket</h2>
      <form onSubmit={handleSubmit}>
        {/* Ticket Name */}
        <div className="form-group">
          <label>Ticket Name</label>
          <input
            type="text"
            name="ticketName"
            value={ticketName}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Quantity */}
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={quantity}
            onChange={handleInputChange}
            min="0"
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={description}
            onChange={handleInputChange}
          />
        </div>

        {/* Ticket Type */}
        <div className="form-group">
          <label>Ticket Type</label>
          <select
            name="ticketType"
            value={ticketType}
            onChange={handleInputChange}
          >
            <option value="paid">Paid</option>
            <option value="free">Free</option>
          </select>
        </div>

        {/* Domains */}
        <div className="form-group">
          <label>Domains</label>
          {domains.map((domain, index) => (
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
                value={domain.price === "" ? "" : domain.price}
                onChange={(e) => handleDomainChange(index, e)}
                min="0"
                required
              />
              <button
                type="button"
                onClick={() => removeDomain(index)}
                disabled={domains.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addDomain}>
            Add Domain
          </button>
        </div>

        {/* Submit Button */}
        <button type="submit">Update Ticket</button>
      </form>
    </div>
  );
};

export default EditTicket;