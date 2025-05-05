import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./context/AuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./CreateEvent.css";
import CustomSections from "./EventForm/CustomSections";
import Sponsors from "./EventForm/Sponsors";
import Timeline from "./EventForm/Timeline";
import FAQs from "./EventForm/FAQs";
import ContactDetails from "./EventForm/ContactDetails";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from auth context

  // State to track user's selection
  const [eventType, setEventType] = useState(null);

  // State for basic event details
  const [bannerImage, setBannerImage] = useState(
    "https://res.cloudinary.com/dco33etmd/image/upload/v1742632503/kpauanxinnhuhelrq3zw.jpg"
  );
  const [title, setTitle] = useState("");
  const [dateOfConduct, setDateOfConduct] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [prizePool, setPrizePool] = useState(0);
  const [maxTeams, setMaxTeams] = useState(1);
  const [maxTeamSize, setMaxTeamSize] = useState(1);
  const [minTeamSize, setMinTeamSize] = useState(1);
  const [status, setStatus] = useState("upcoming");

  // State for dynamic sections
  const [timeline, setTimeline] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [customSections, setCustomSections] = useState([]);

  // Contact details
  const [phone, setPhone] = useState("");
  const [whatsappGroup, setWhatsappGroup] = useState("");

  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Image Upload Handler
  const handleFileUpload = async (event, setImage) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Hackly");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dco33etmd/image/upload",
        formData
      );
      setImage(response.data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image");
    }
  };

  // Submit Event Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("Please login to create events");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const eventData = {
      bannerImage,
      title,
      dateOfConduct: new Date(dateOfConduct),
      description,
      location,
      city,
      type: eventType,
      prizePool: Number(prizePool),
      maxTeams: Number(maxTeams),
      maxTeamSize: Number(maxTeamSize),
      minTeamSize: Number(minTeamSize),
      status,
      queries: { phone, whatsappGroup },
      timeline,
      faqs,
      sponsors,
      customSections,
      createdBy: user.email // Ensure this is being set correctly
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/create-event", 
        eventData,
        {
          withCredentials: true // Include cookies for authentication
        }
      );
      navigate(`/create-ticket/${response.data.eventId}`);
    } catch (error) {
      console.error("Error creating event:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please login again");
      } else {
        setError(error.response?.data?.error || "Failed to create event");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the form based on event type
  const renderForm = () => {
    if (eventType === "hackathon") {
      return (
        <>
          <div className="form-group">
            <label>Prize Pool:</label>
            <input
              type="number"
              value={prizePool}
              onChange={(e) => setPrizePool(e.target.value)}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Max Teams:</label>
            <input
              type="number"
              value={maxTeams}
              onChange={(e) => setMaxTeams(e.target.value)}
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Max Team Size:</label>
            <input
              type="number"
              value={maxTeamSize}
              onChange={(e) => setMaxTeamSize(e.target.value)}
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Min Team Size:</label>
            <input
              type="number"
              value={minTeamSize}
              onChange={(e) => setMinTeamSize(e.target.value)}
              min="1"
            />
          </div>

          <CustomSections
            customSections={customSections}
            setCustomSections={setCustomSections}
            handleFileUpload={handleFileUpload}
          />

          <Timeline timeline={timeline} setTimeline={setTimeline} />
        </>
      );
    }
    return null;
  };

  return (
    <div className="create-event-container">
      <h2>Create an Event</h2>
      {error && <div className="error-message">{error}</div>}

      {!eventType ? (
        <div className="event-type-selection">
          <h3>Select Event Type</h3>
          <button 
            onClick={() => setEventType("event")}
            className="event-type-btn"
          >
            Create Event
          </button>
          <button 
            onClick={() => setEventType("hackathon")}
            className="event-type-btn"
          >
            Create Hackathon
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label>Banner Image:</label>
            <input
              type="file"
              onChange={(e) => handleFileUpload(e, setBannerImage)}
              accept="image/*"
            />
            {bannerImage !==
              "https://res.cloudinary.com/dco33etmd/image/upload/v1742632503/kpauanxinnhuhelrq3zw.jpg" && (
              <img
                src={bannerImage}
                alt="Banner Preview"
                className="banner-preview"
              />
            )}
          </div>

          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Date of Conduct:</label>
            <input
              type="date"
              value={dateOfConduct}
              onChange={(e) => setDateOfConduct(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <ReactQuill
              value={description}
              onChange={setDescription}
              modules={{
                toolbar: [
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              theme="snow"
            />
          </div>

          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>City:</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            >
              <option value="">Select a city</option>
              <option value="Bangalore (Bengaluru), Karnataka">Bangalore</option>
              <option value="Hyderabad, Telangana">Hyderabad</option>
              <option value="Chennai, Tamil Nadu">Chennai</option>
              {/* Other city options */}
            </select>
          </div>

          <div className="form-group">
            <label>Status:</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {renderForm()}

          <Sponsors
            sponsors={sponsors}
            setSponsors={setSponsors}
            handleFileUpload={handleFileUpload}
          />

          <FAQs faqs={faqs} setFaqs={setFaqs} />

          <ContactDetails
            phone={phone}
            setPhone={setPhone}
            whatsappGroup={whatsappGroup}
            setWhatsappGroup={setWhatsappGroup}
          />

          <button 
            type="submit" 
            className="submit-button" 
            disabled={isSubmitting || !user}
          >
            {isSubmitting ? "Creating..." : "Create Event"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateEvent;
