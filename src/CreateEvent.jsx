import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

  // State to track user's selection
  const [eventType, setEventType] = useState(null);

  // State for basic event details
  const [bannerImage, setBannerImage] = useState(
    "https://res.cloudinary.com/dco33etmd/image/upload/v1742632503/kpauanxinnhuhelrq3zw.jpg"
  );
  const [title, setTitle] = useState("");
  const [dateOfConduct, setDateOfConduct] = useState("");
  const [description, setDescription] = useState(""); // Rich text description
  const [location, setLocation] = useState("");
  const [city, setCity] = useState(""); // New field for city
  const [prizePool, setPrizePool] = useState(0); // Default to 0
  const [maxTeams, setMaxTeams] = useState(1); // Default to 1
  const [maxTeamSize, setMaxTeamSize] = useState(1); // Default to 1
  const [minTeamSize, setMinTeamSize] = useState(1); // Default to 1
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
    }
  };

  // Submit Event Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const eventData = {
      bannerImage,
      title,
      dateOfConduct: new Date(dateOfConduct), // Ensure it's a valid Date object
      description,
      location,
      city, // Add city
      type: eventType, // Set type based on user selection
      prizePool: Number(prizePool), // Ensure it's a number
      maxTeams: Number(maxTeams), // Ensure it's a number
      maxTeamSize: Number(maxTeamSize), // Ensure it's a number
      minTeamSize: Number(minTeamSize), // Ensure it's a number
      status,
      queries: { phone, whatsappGroup },
      timeline,
      faqs,
      sponsors,
      customSections,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/create-event", eventData);
      const eventId = response.data.eventId;
      navigate(`/create-ticket/${eventId}`);
    } catch (error) {
      setError("Failed to create event. Please try again.");
      console.error("Error creating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the form based on event type
  const renderForm = () => {
    if (eventType === "hackathon") {
      return (
        <>
          {/* Prize Pool */}
          <div className="form-group">
            <label>Prize Pool:</label>
            <input
              type="number"
              value={prizePool}
              onChange={(e) => setPrizePool(e.target.value)}
              min="0" // Ensure it's not negative
            />
          </div>

          {/* Team Details */}
          <div className="form-group">
            <label>Max Teams:</label>
            <input
              type="number"
              value={maxTeams}
              onChange={(e) => setMaxTeams(e.target.value)}
              min="1" // Ensure it's at least 1
            />
          </div>

          <div className="form-group">
            <label>Max Team Size:</label>
            <input
              type="number"
              value={maxTeamSize}
              onChange={(e) => setMaxTeamSize(e.target.value)}
              min="1" // Ensure it's at least 1
            />
          </div>

          <div className="form-group">
            <label>Min Team Size:</label>
            <input
              type="number"
              value={minTeamSize}
              onChange={(e) => setMinTeamSize(e.target.value)}
              min="1" // Ensure it's at least 1
            />
          </div>

          {/* Custom Sections */}
          <CustomSections
            customSections={customSections}
            setCustomSections={setCustomSections}
            handleFileUpload={handleFileUpload}
          />

          {/* Timeline */}
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
          <button onClick={() => setEventType("event")}>Create Event</button>
          <button onClick={() => setEventType("hackathon")}>Create Hackathon</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="event-form">
          {/* Banner Image */}
          <div className="form-group">
            <label>Banner Image:</label>
            <input
              type="file"
              onChange={(e) => handleFileUpload(e, setBannerImage)}
            />
            {/* Only show the preview if a new image is uploaded */}
            {bannerImage !==
              "https://res.cloudinary.com/dco33etmd/image/upload/v1742632503/kpauanxinnhuhelrq3zw.jpg" && (
              <img
                src={bannerImage}
                alt="Banner Preview"
                className="banner-preview"
              />
            )}
          </div>

          {/* Title */}
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Date of Conduct */}
          <div className="form-group">
            <label>Date of Conduct:</label>
            <input
              type="date"
              value={dateOfConduct}
              onChange={(e) => setDateOfConduct(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description:</label>
            <ReactQuill
              value={description}
              onChange={setDescription}
              modules={{
                toolbar: [
                  ["bold", "italic", "underline", "strike"], // Text formatting
                  [{ list: "ordered" }, { list: "bullet" }], // Lists
                  ["link", "image"], // Links and images
                  ["clean"], // Remove formatting
                ],
              }}
              theme="snow" // Theme for the editor
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* City */}
          <div className="form-group">
            <label>City:</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            >
              <option value="">Select a city</option>
              <option value="Bangalore (Bengaluru), Karnataka">Bangalore (Bengaluru), Karnataka</option>
              <option value="Hyderabad, Telangana">Hyderabad, Telangana</option>
              <option value="Chennai, Tamil Nadu">Chennai, Tamil Nadu</option>
              <option value="Pune, Maharashtra">Pune, Maharashtra</option>
              <option value="Mumbai, Maharashtra">Mumbai, Maharashtra</option>
              <option value="Delhi (NCR - National Capital Region)">Delhi (NCR - National Capital Region)</option>
              <option value="Kolkata, West Bengal">Kolkata, West Bengal</option>
              <option value="Coimbatore, Tamil Nadu">Coimbatore, Tamil Nadu</option>
              <option value="Jaipur, Rajasthan">Jaipur, Rajasthan</option>
              <option value="Ahmedabad, Gujarat">Ahmedabad, Gujarat</option>
              <option value="Vellore, Tamil Nadu">Vellore, Tamil Nadu</option>
              <option value="Visakhapatnam, Andhra Pradesh">Visakhapatnam, Andhra Pradesh</option>
              <option value="Nagpur, Maharashtra">Nagpur, Maharashtra</option>
              <option value="Bhopal, Madhya Pradesh">Bhopal, Madhya Pradesh</option>
              <option value="Lucknow, Uttar Pradesh">Lucknow, Uttar Pradesh</option>
              <option value="Kochi (Cochin), Kerala">Kochi (Cochin), Kerala</option>
              <option value="Mysore (Mysuru), Karnataka">Mysore (Mysuru), Karnataka</option>
              <option value="Surat, Gujarat">Surat, Gujarat</option>
              <option value="Indore, Madhya Pradesh">Indore, Madhya Pradesh</option>
              <option value="Thiruvananthapuram, Kerala">Thiruvananthapuram, Kerala</option>
            </select>
          </div>

          {/* Status */}
          <div className="form-group">
            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Render additional fields based on event type */}
          {renderForm()}

          {/* Sponsors */}
          <Sponsors
            sponsors={sponsors}
            setSponsors={setSponsors}
            handleFileUpload={handleFileUpload}
          />

          {/* FAQs */}
          <FAQs faqs={faqs} setFaqs={setFaqs} />

          {/* Contact Details */}
          <ContactDetails
            phone={phone}
            setPhone={setPhone}
            whatsappGroup={whatsappGroup}
            setWhatsappGroup={setWhatsappGroup}
          />

          {/* Submit Button */}
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Event"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateEvent;

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import "./CreateEvent.css";
// import CustomSections from "./EventForm/CustomSections";
// import Sponsors from "./EventForm/Sponsors";
// import Timeline from "./EventForm/Timeline";
// import FAQs from "./EventForm/FAQs";
// import ContactDetails from "./EventForm/ContactDetails";

// const CreateEvent = () => {
//   const navigate = useNavigate();

//   // Authentication state
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [authLoading, setAuthLoading] = useState(true);

//   // Event form state
//   const [eventType, setEventType] = useState(null);
//   const [bannerImage, setBannerImage] = useState(
//     "https://res.cloudinary.com/dco33etmd/image/upload/v1742632503/kpauanxinnhuhelrq3zw.jpg"
//   );
//   const [title, setTitle] = useState("");
//   const [dateOfConduct, setDateOfConduct] = useState("");
//   const [description, setDescription] = useState("");
//   const [location, setLocation] = useState("");
//   const [city, setCity] = useState("");
//   const [prizePool, setPrizePool] = useState(0);
//   const [maxTeams, setMaxTeams] = useState(1);
//   const [maxTeamSize, setMaxTeamSize] = useState(1);
//   const [minTeamSize, setMinTeamSize] = useState(1);
//   const [status, setStatus] = useState("upcoming");
//   const [timeline, setTimeline] = useState([]);
//   const [faqs, setFaqs] = useState([]);
//   const [sponsors, setSponsors] = useState([]);
//   const [customSections, setCustomSections] = useState([]);
//   const [phone, setPhone] = useState("");
//   const [whatsappGroup, setWhatsappGroup] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   // Check authentication on component mount
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/user', {
//           withCredentials: true
//         });
        
//         if (response.data.isAuthenticated) {
//           setIsAuthenticated(true);
//         } else {
//           navigate('/login');
//         }
//       } catch (error) {
//         console.error('Auth check failed:', error);
//         navigate('/login');
//       } finally {
//         setAuthLoading(false);
//       }
//     };

//     checkAuth();
//   }, [navigate]);

//   // Image Upload Handler
//   const handleFileUpload = async (event, setImage) => {
//     const file = event.target.files[0];
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "Hackly");

//     try {
//       const response = await axios.post(
//         "https://api.cloudinary.com/v1_1/dco33etmd/image/upload",
//         formData
//       );
//       setImage(response.data.secure_url);
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   };

//   // Submit Event Data
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError("");

//     const eventData = {
//       bannerImage,
//       title,
//       dateOfConduct: new Date(dateOfConduct),
//       description,
//       location,
//       city,
//       type: eventType,
//       prizePool: Number(prizePool),
//       maxTeams: Number(maxTeams),
//       maxTeamSize: Number(maxTeamSize),
//       minTeamSize: Number(minTeamSize),
//       status,
//       queries: { phone, whatsappGroup },
//       timeline,
//       faqs,
//       sponsors,
//       customSections,
//     };

//     try {
//       const response = await axios.post(
//         "http://localhost:8080/api/create-event", 
//         eventData,
//         { withCredentials: true }
//       );
//       const eventId = response.data.eventId;
//       navigate(`/create-ticket/${eventId}`);
//     } catch (error) {
//       if (error.response?.status === 401) {
//         navigate('/login');
//       } else {
//         setError("Failed to create event. Please try again.");
//         console.error("Error creating event:", error);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Render the form based on event type
//   const renderForm = () => {
//     if (eventType === "hackathon") {
//       return (
//         <>
//           <div className="form-group">
//             <label>Prize Pool:</label>
//             <input
//               type="number"
//               value={prizePool}
//               onChange={(e) => setPrizePool(e.target.value)}
//               min="0"
//             />
//           </div>

//           <div className="form-group">
//             <label>Max Teams:</label>
//             <input
//               type="number"
//               value={maxTeams}
//               onChange={(e) => setMaxTeams(e.target.value)}
//               min="1"
//             />
//           </div>

//           <div className="form-group">
//             <label>Max Team Size:</label>
//             <input
//               type="number"
//               value={maxTeamSize}
//               onChange={(e) => setMaxTeamSize(e.target.value)}
//               min="1"
//             />
//           </div>

//           <div className="form-group">
//             <label>Min Team Size:</label>
//             <input
//               type="number"
//               value={minTeamSize}
//               onChange={(e) => setMinTeamSize(e.target.value)}
//               min="1"
//             />
//           </div>

//           <CustomSections
//             customSections={customSections}
//             setCustomSections={setCustomSections}
//             handleFileUpload={handleFileUpload}
//           />

//           <Timeline timeline={timeline} setTimeline={setTimeline} />
//         </>
//       );
//     }
//     return null;
//   };

//   if (authLoading) {
//     return <div className="loading-container">Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     return null;
//   }

//   return (
//     <div className="create-event-container">
//       <h2>Create an Event</h2>
//       {error && <div className="error-message">{error}</div>}

//       {!eventType ? (
//         <div className="event-type-selection">
//           <h3>Select Event Type</h3>
//           <button onClick={() => setEventType("event")}>Create Event</button>
//           <button onClick={() => setEventType("hackathon")}>Create Hackathon</button>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="event-form">
//           <div className="form-group">
//             <label>Banner Image:</label>
//             <input
//               type="file"
//               onChange={(e) => handleFileUpload(e, setBannerImage)}
//             />
//             {bannerImage !==
//               "https://res.cloudinary.com/dco33etmd/image/upload/v1742632503/kpauanxinnhuhelrq3zw.jpg" && (
//               <img
//                 src={bannerImage}
//                 alt="Banner Preview"
//                 className="banner-preview"
//               />
//             )}
//           </div>

//           <div className="form-group">
//             <label>Title:</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Date of Conduct:</label>
//             <input
//               type="date"
//               value={dateOfConduct}
//               onChange={(e) => setDateOfConduct(e.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Description:</label>
//             <ReactQuill
//               value={description}
//               onChange={setDescription}
//               modules={{
//                 toolbar: [
//                   ["bold", "italic", "underline", "strike"],
//                   [{ list: "ordered" }, { list: "bullet" }],
//                   ["link", "image"],
//                   ["clean"],
//                 ],
//               }}
//               theme="snow"
//             />
//           </div>

//           <div className="form-group">
//             <label>Location:</label>
//             <input
//               type="text"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>City:</label>
//             <select
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//               required
//             >
//               <option value="">Select a city</option>
//               <option value="Bangalore (Bengaluru), Karnataka">Bangalore</option>
//               <option value="Hyderabad, Telangana">Hyderabad</option>
//               <option value="Chennai, Tamil Nadu">Chennai</option>
//               {/* Other city options */}
//             </select>
//           </div>

//           <div className="form-group">
//             <label>Status:</label>
//             <select value={status} onChange={(e) => setStatus(e.target.value)}>
//               <option value="upcoming">Upcoming</option>
//               <option value="ongoing">Ongoing</option>
//               <option value="completed">Completed</option>
//             </select>
//           </div>

//           {renderForm()}

//           <Sponsors
//             sponsors={sponsors}
//             setSponsors={setSponsors}
//             handleFileUpload={handleFileUpload}
//           />

//           <FAQs faqs={faqs} setFaqs={setFaqs} />

//           <ContactDetails
//             phone={phone}
//             setPhone={setPhone}
//             whatsappGroup={whatsappGroup}
//             setWhatsappGroup={setWhatsappGroup}
//           />

//           <button type="submit" className="submit-button" disabled={isSubmitting}>
//             {isSubmitting ? "Creating..." : "Create Event"}
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default CreateEvent;