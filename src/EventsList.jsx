import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Event from "./EventCard";
import "./EventsList.css";
import { Link } from "react-router-dom";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/events")
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setError("Failed to fetch events. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (error) {
    return (
      <div className="error-container">
        <Header />
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="events-container">
      <h2 className="events-title">Upcoming Events</h2>
      {loading ? (
        <div className="shimmer-container">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="shimmer-card">
              <div className="shimmer-image"></div>
              <div className="shimmer-title"></div>
              <div className="shimmer-description"></div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <p className="no-events">No events found.</p>
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <Link to={"/event/" + event._id} key={event._id}>
              <Event event={event} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsList;
