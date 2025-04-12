import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateTicket.css";

const CreateTicket = () => {
  const { id: eventId } = useParams(); // Extract eventId from the URL
  const navigate = useNavigate();
  const [ticketName, setTicketName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [ticketType, setTicketType] = useState("paid");
  const [domains, setDomains] = useState([{ domainName: "", price: "" }]);

  // Handle input changes for ticket fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "ticketName") setTicketName(value);
    else if (name === "quantity") setQuantity((value));
    else if (name === "description") setDescription(value);
    else if (name === "ticketType") {
      setTicketType(value);
      // If ticket type is "free", set all domain prices to 0
      if (value === "free") {
        setDomains((prevDomains) =>
          prevDomains.map((domain) => ({ ...domain, price: 0 }))
        );
      }
    }
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
    setDomains([...domains, { domainName: "", price: ticketType === "free" ? 0 : "" }]);
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
      eventId, // Use the eventId from the URL
      ticketName,
      domains: formattedDomains,
      quantity,
      description,
      ticketType,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/tickets", ticketData);
      navigate("/event/" + eventId);
      // Reset form after submission
      setTicketName("");
      setQuantity(0);
      setDescription("");
      setTicketType("paid");
      setDomains([{ domainName: "", price: "" }]);
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket. Please try again.");
    }
  };

  return (
    <div className="create-ticket-container">
      <h2>Create Ticket for Event ID: {eventId}</h2>
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

        {/* Domains - Conditionally render based on ticket type */}
        {ticketType === "paid" && (
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
        )}

        {/* Submit Button */}
        <button type="submit">Create Ticket</button>
      </form>
    </div>
  );
};

export default CreateTicket;
