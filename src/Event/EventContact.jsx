import React from "react";
import "./EventContact.css";

const EventContact = ({ queries }) => (
  <div className="event-contact">
    <h2>Contact</h2>
    <p>Phone: {queries?.phone || "Not Available"}</p>
    <p>
      WhatsApp Group:{" "}
      {queries?.whatsappGroup ? (
        <a href={queries.whatsappGroup} target="_blank" rel="noopener noreferrer">
          Join
        </a>
      ) : (
        "Not Available"
      )}
    </p>
  </div>
);

export default EventContact;
