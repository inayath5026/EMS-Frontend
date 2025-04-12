import React from "react";

const ContactDetails = ({ phone, setPhone, whatsappGroup, setWhatsappGroup }) => {
  return (
    <div className="form-group">
      <h3>Contact Details</h3>
      <label>Phone:</label>
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <label>WhatsApp Group Link:</label>
      <input
        type="text"
        value={whatsappGroup}
        onChange={(e) => setWhatsappGroup(e.target.value)}
        required
      />
    </div>
  );
};

export default ContactDetails;
