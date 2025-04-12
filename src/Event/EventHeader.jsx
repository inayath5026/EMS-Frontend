import React from "react";
import "./EventHeader.css";

const EventHeader = ({ event }) => (
  <header className="event-header">
    <h1>{event.title}</h1>
    <p>
      {event.dateOfConduct
        ? new Date(event.dateOfConduct).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "Not Available"}
    </p>
  </header>
);

export default EventHeader;
