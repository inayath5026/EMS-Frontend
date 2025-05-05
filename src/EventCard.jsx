import React from "react";
import "./EventCard.css";

const EventCard = ({ event }) => {

  return (
    <div className="event-card">
      <h3 className="event-title">{event.title}</h3>
      {/* <p className="event-description">{event.description}</p> */}
      <p className="event-description" dangerouslySetInnerHTML={{ __html: event.description }}></p>
      <p className="event-date">
        <strong>Date:</strong>{" "}
        {event.dateOfConduct
          ? new Date(event.dateOfConduct).toLocaleDateString()
          : "Date not available"}
      </p>
    </div>
  );
};

export default EventCard;
