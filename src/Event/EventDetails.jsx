import React from "react";
import "./EventDetails.css";

const EventDetails = ({ event }) => {
  // Helper function to check if a value exists
  const hasValue = (value) => {
    return value !== null && value !== undefined && value !== "";
  };

  return (
    <div className="event-details">
      {/* Location */}
      {hasValue(event.location) && (
        <>
          <h2>Location</h2>
          <p>{event.location}</p>
        </>
      )}

      {/* Prize Pool */}
      {(event.type == 'hackathon') && (
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
