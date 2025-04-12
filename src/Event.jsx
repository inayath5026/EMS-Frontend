import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Faqs from "./Event/EventFaqs";
import Timeline from "./Event/EventTimeline";
import EventHeader from "./Event/EventHeader";
import EventDetails from "./Event/EventDetails";
import EventCustomSections from "./Event/EventCustomSections";
import EventSponsors from "./Event/EventSponsors";
import EventContact from "./Event/EventContact";
import "./Event.css";

const Event = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/event/${id}`);
        if (!response.ok) {
          throw new Error("Event not found");
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/event/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }

      navigate("/");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmation = (confirmed) => {
    if (confirmed) {
      handleDelete();
    }
    setShowDeleteConfirmation(false);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!event) return <div className="error-message">Event not found</div>;

  return (
    <div className="event-container">
      {/* Hero Section */}
      <div className="hero-section">
        {event.bannerImage && (
          <img src={event.bannerImage} alt="Event Banner" className="banner" />
        )}
        <div className="hero-content">
          <EventHeader event={event} />
          <div className="action-buttons">
            <button
              onClick={() => navigate("/edit/" + event._id)}
              className="edit-button"
            >
              Edit Event
            </button>
            <button onClick={confirmDelete} className="delete-button">
              Delete Event
            </button>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <EventDetails event={event} />

      {/* Register Button */}
      <button>
        <Link to={"/tickets/" + id}>Register</Link>
      </button>

      {/* Custom Sections */}
      {event.customSections && event.customSections.length > 0 && (
        <EventCustomSections customSections={event.customSections} />
      )}

      {/* Team Details */}
      {event.maxTeams && (
        <div className="team-details">
          <h2>Team Details</h2>
          <p>Max Teams: {event.maxTeams}</p>
          <p>
            Team Size: {event.minTeamSize} - {event.maxTeamSize} members
          </p>
        </div>
      )}

      {/* Timeline */}
      {event.timeline && event.timeline.length > 0 && (
        <Timeline timeline={event.timeline} />
      )}

      {/* Sponsors */}
      {event.sponsors && event.sponsors.length > 0 && (
        <EventSponsors sponsors={event.sponsors} />
      )}

      {/* FAQs */}
      {event.faqs && event.faqs.length > 0 && <Faqs faqs={event.faqs} />}

      {/* Contact */}
      <EventContact queries={event.queries} />

      {/* Delete Confirmation Pop-up */}
      {showDeleteConfirmation && (
        <div className="delete-confirmation-popup">
          <div className="popup-content">
            <h3>Are you sure you want to delete this event?</h3>
            <p>This action cannot be undone.</p>
            <div className="popup-buttons">
              <button
                onClick={() => handleDeleteConfirmation(true)}
                className="confirm-button"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => handleDeleteConfirmation(false)}
                className="cancel-button"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Event;
