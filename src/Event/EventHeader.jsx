import React from "react";
import { Link } from "react-router-dom";
import "./EventHeader.css";

const EventHeader = ({ event }) => {
  const formattedDate = event.dateOfConduct
    ? new Date(event.dateOfConduct).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date not specified";

  return (
    <header className="event-header">
      {/* Blurred Background with Content Overlay */}
      <div className="event-banner-section">
        <div
          className="event-blurred-background"
          style={{ backgroundImage: `url(${event.bannerImage})` }}
        />
        <div className="event-banner-content">
          <img
            src={event.bannerImage}
            alt="Event Banner"
            className="event-main-image"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      </div>

      {/* Separated Content Section */}
      <div className="event-info-section">
        <h1 className="event-title">{event.title}</h1>
        <div className="event-details">
          <p className="event-date">{formattedDate}</p>
          {event.location && <p className="event-location">{event.location}</p>}
        </div>
        <Link to={`/tickets/${event._id}`} className="register-button">
          Book Tickets
        </Link>
      </div>
    </header>
  );
};

export default EventHeader;