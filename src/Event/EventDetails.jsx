import React from "react";
import "./EventDetails.css";

const EventDetails = ({ event }) => {
  // Helper function to check if a value exists
  const hasValue = (value) => {
    return value !== null && value !== undefined && value !== "";
  };

  return (
    <div className="event-details">
      {/* Description */}
      {hasValue(event.description) && (
        <>
          <h2>Description</h2>
          <div
            dangerouslySetInnerHTML={{ __html: event.description }} // Render HTML
          />
        </>
      )}

      {/* Location */}
      {hasValue(event.location) && (
        <>
          <h2>Location</h2>
          <p>{event.location}</p>
        </>
      )}

      {/* Prize Pool */}
      {hasValue(event.prizePool) && (
        <>
          <h2>Prize Pool</h2>
          <p>₹{event.prizePool}</p>
        </>
      )}

      {/* Status */}
      {hasValue(event.status) && (
        <>
          <h2>Status</h2>
          <p className={`status ${event.status}`}>{event.status}</p>
        </>
      )}
    </div>
  );
};

export default EventDetails;
