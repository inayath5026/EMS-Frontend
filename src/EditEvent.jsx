// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import "./CreateEvent.css";

// const EditEvent = () => {
//   const navigate = useNavigate();
//   const { id } = useParams(); 

//   // State for form fields
//   const [bannerImage, setBannerImage] = useState("");
//   const [title, setTitle] = useState("");
//   const [dateOfConduct, setDateOfConduct] = useState("");
//   const [description, setDescription] = useState("");
//   const [location, setLocation] = useState("");
//   const [prizePool, setPrizePool] = useState("");
//   const [maxTeams, setMaxTeams] = useState("");
//   const [maxTeamSize, setMaxTeamSize] = useState("");
//   const [minTeamSize, setMinTeamSize] = useState("");
//   const [status, setStatus] = useState("upcoming");
//   const [phone, setPhone] = useState("");
//   const [whatsappGroup, setWhatsappGroup] = useState("");

//   const [timeline, setTimeline] = useState([{ title: "", description: "", date: "" }]);
//   const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
//   const [sponsors, setSponsors] = useState([{ name: "", logo: "" }]);
//   const [customSections, setCustomSections] = useState([{ header: "", divs: [{ image: "", title: "" }] }]);

//   // Helper function to format ISO date to "yyyy-MM-dd"
//   const formatDateForInput = (isoDate) => {
//     if (!isoDate) return ""; // Handle null/undefined dates
//     const date = new Date(isoDate);
//     return date.toISOString().split("T")[0]; // Convert to "yyyy-MM-dd"
//   };

//   // Fetch event data when the component mounts
//   useEffect(() => {
//     const fetchEventData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/api/event/${id}`);
//         const eventData = response.data;

//         // Set state with fetched event data
//         setBannerImage(eventData.bannerImage || "");
//         setTitle(eventData.title || "");
//         setDateOfConduct(formatDateForInput(eventData.dateOfConduct)); // Format date
//         setDescription(eventData.description || "");
//         setLocation(eventData.location || "");
//         setPrizePool(eventData.prizePool || "");
//         setMaxTeams(eventData.maxTeams || "");
//         setMaxTeamSize(eventData.maxTeamSize || "");
//         setMinTeamSize(eventData.minTeamSize || "");
//         setStatus(eventData.status || "upcoming");
//         setPhone(eventData.queries?.phone || "");
//         setWhatsappGroup(eventData.queries?.whatsappGroup || "");
//         setTimeline(eventData.timeline || [{ title: "", description: "", date: "" }]);
//         setFaqs(eventData.faqs || [{ question: "", answer: "" }]);
//         setSponsors(eventData.sponsors || [{ name: "", logo: "" }]);
//         setCustomSections(eventData.customSections || [{ header: "", divs: [{ image: "", title: "" }] }]);
//       } catch (error) {
//         console.error("Error fetching event data:", error);
//       }
//     };

//     fetchEventData();
//   }, [id]);

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

//   // Submit Updated Event Data
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const eventData = {
//       bannerImage,
//       title,
//       dateOfConduct,
//       description,
//       location,
//       prizePool,
//       maxTeams,
//       maxTeamSize,
//       minTeamSize,
//       status,
//       queries: { phone, whatsappGroup },
//       timeline,
//       faqs,
//       sponsors,
//       customSections,
//     };

//     try {
//       await axios.put(`http://localhost:8080/api/events/${id}`, eventData);
//       navigate(`/event/${id}`);
//     } catch (error) {
//       console.error("Error updating event:", error);
//     }
//   };

//   return (
//     <div className="create-event-container">
//       <h2>Edit Event</h2>
//       <form onSubmit={handleSubmit}>
//         <label>Banner Image:</label>
//         <input
//           type="file"
//           onChange={(e) => handleFileUpload(e, setBannerImage)}
//         />
//         <br />
//         {bannerImage && (
//           <img src={bannerImage} alt="Banner Preview" width="200" />
//         )}

//         <label>Title:</label>
//         <input
//           type="text"
//           value={title || ""}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//         <br />

//         <label>Date of Conduct:</label>
//         <input
//           type="date"
//           value={dateOfConduct || ""}
//           onChange={(e) => setDateOfConduct(e.target.value)}
//           required
//         />
//         <br />

//         <label>Description:</label>
//         <textarea
//           value={description || ""}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//         ></textarea>
//         <br />

//         <label>Location:</label>
//         <input
//           type="text"
//           value={location || ""}
//           onChange={(e) => setLocation(e.target.value)}
//           required
//         />
//         <br />

//         <label>Prize Pool:</label>
//         <input
//           type="number"
//           value={prizePool || ""}
//           onChange={(e) => setPrizePool(e.target.value)}
//         />
//         <br />

//         <label>Max Teams:</label>
//         <input
//           type="number"
//           value={maxTeams || ""}
//           onChange={(e) => setMaxTeams(e.target.value)}
//         />
//         <br />

//         <label>Max Team Size:</label>
//         <input
//           type="number"
//           value={maxTeamSize || ""}
//           onChange={(e) => setMaxTeamSize(e.target.value)}
//         />
//         <br />

//         <label>Min Team Size:</label>
//         <input
//           type="number"
//           value={minTeamSize || ""}
//           onChange={(e) => setMinTeamSize(e.target.value)}
//         />
//         <br />

//         <label>Status:</label>
//         <select value={status || "upcoming"} onChange={(e) => setStatus(e.target.value)}>
//           <option value="upcoming">Upcoming</option>
//           <option value="ongoing">Ongoing</option>
//           <option value="completed">Completed</option>
//         </select>
//         <br />

//         <h3>Custom Sections</h3>
//         {customSections.map((section, index) => (
//           <div key={index}>
//             <input
//               type="text"
//               placeholder="Header"
//               value={section.header || ""}
//               onChange={(e) => {
//                 const newSections = [...customSections];
//                 newSections[index].header = e.target.value;
//                 setCustomSections(newSections);
//               }}
//             />
//             {section.divs.map((div, divIndex) => (
//               <div key={divIndex}>
//                 <input
//                   type="text"
//                   placeholder="Title"
//                   value={div.title || ""}
//                   onChange={(e) => {
//                     const newSections = [...customSections];
//                     newSections[index].divs[divIndex].title = e.target.value;
//                     setCustomSections(newSections);
//                   }}
//                 />
//                 <input
//                   type="file"
//                   onChange={(e) =>
//                     handleFileUpload(e, (url) => {
//                       const newSections = [...customSections];
//                       newSections[index].divs[divIndex].image = url;
//                       setCustomSections(newSections);
//                     })
//                   }
//                 />
//                 {div.image && (
//                   <img src={div.image} alt="Div Preview" width="100" />
//                 )}
//                 <button
//                   type="button"
//                   onClick={() => {
//                     const newSections = [...customSections];
//                     newSections[index].divs.splice(divIndex, 1);
//                     setCustomSections(newSections);
//                   }}
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => {
//                 const newSections = [...customSections];
//                 newSections[index].divs.push({ image: "", title: "" });
//                 setCustomSections(newSections);
//               }}
//             >
//               + Add Div
//             </button>
//             <button
//               type="button"
//               onClick={() =>
//                 setCustomSections(customSections.filter((_, i) => i !== index))
//               }
//             >
//               Remove Section
//             </button>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={() =>
//             setCustomSections([
//               ...customSections,
//               { header: "", divs: [{ image: "", title: "" }] },
//             ])
//           }
//         >
//           + Add Custom Section
//         </button>
//         <br />

//         <h3>Sponsors</h3>
//         {sponsors.map((sponsor, index) => (
//           <div key={index}>
//             <input
//               type="text"
//               placeholder="Sponsor Name"
//               value={sponsor.name || ""}
//               onChange={(e) => {
//                 const newSponsors = [...sponsors];
//                 newSponsors[index].name = e.target.value;
//                 setSponsors(newSponsors);
//               }}
//             />
//             <input
//               type="file"
//               onChange={(e) =>
//                 handleFileUpload(e, (url) => {
//                   const newSponsors = [...sponsors];
//                   newSponsors[index].logo = url;
//                   setSponsors(newSponsors);
//                 })
//               }
//             />
//             {sponsor.logo && (
//               <img src={sponsor.logo} alt="Sponsor Logo" width="100" />
//             )}
//             <button
//               type="button"
//               onClick={() =>
//                 setSponsors(sponsors.filter((_, i) => i !== index))
//               }
//             >
//               Remove
//             </button>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={() => setSponsors([...sponsors, { name: "", logo: "" }])}
//         >
//           + Add Sponsor
//         </button>
//         <br />

//         <h3>Timeline</h3>
//         {timeline.map((item, index) => (
//           <div key={index}>
//             <input
//               type="text"
//               placeholder="Title"
//               value={item.title || ""}
//               onChange={(e) => {
//                 const newTimeline = [...timeline];
//                 newTimeline[index].title = e.target.value;
//                 setTimeline(newTimeline);
//               }}
//             />
//             <input
//               type="text"
//               placeholder="Description"
//               value={item.description || ""}
//               onChange={(e) => {
//                 const newTimeline = [...timeline];
//                 newTimeline[index].description = e.target.value;
//                 setTimeline(newTimeline);
//               }}
//             />
//             <input
//               type="date"
//               value={formatDateForInput(item.date) || ""}
//               onChange={(e) => {
//                 const newTimeline = [...timeline];
//                 newTimeline[index].date = e.target.value;
//                 setTimeline(newTimeline);
//               }}
//             />
//             <button
//               type="button"
//               onClick={() =>
//                 setTimeline(timeline.filter((_, i) => i !== index))
//               }
//             >
//               Remove
//             </button>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={() =>
//             setTimeline([...timeline, { title: "", description: "", date: "" }])
//           }
//         >
//           + Add Timeline Event
//         </button>
//         <br />

//         <h3>FAQs</h3>
//         {faqs.map((faq, index) => (
//           <div key={index}>
//             <input
//               type="text"
//               placeholder="Question"
//               value={faq.question || ""}
//               onChange={(e) => {
//                 const newFaqs = [...faqs];
//                 newFaqs[index].question = e.target.value;
//                 setFaqs(newFaqs);
//               }}
//             />
//             <textarea
//               placeholder="Answer"
//               value={faq.answer || ""}
//               onChange={(e) => {
//                 const newFaqs = [...faqs];
//                 newFaqs[index].answer = e.target.value;
//                 setFaqs(newFaqs);
//               }}
//             />
//             <button
//               type="button"
//               onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
//             >
//               Remove
//             </button>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
//         >
//           + Add FAQ
//         </button>
//         <br />

//         <h3>Contact Details</h3>
//         <label>Phone:</label>
//         <input
//           type="text"
//           value={phone || ""}
//           onChange={(e) => setPhone(e.target.value)}
//           required
//         />
//         <br />

//         <label>WhatsApp Group Link:</label>
//         <input
//           type="text"
//           value={whatsappGroup || ""}
//           onChange={(e) => setWhatsappGroup(e.target.value)}
//           required
//         />
//         <br />

//         <button type="submit">Update Event</button>
//       </form>
//     </div>
//   );
// };

// export default EditEvent;



import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./EditEvent.css";

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // State for form fields
  const [bannerImage, setBannerImage] = useState("");
  const [title, setTitle] = useState("");
  const [dateOfConduct, setDateOfConduct] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [eventType, setEventType] = useState("event"); // Default to "event"
  const [prizePool, setPrizePool] = useState(0);
  const [maxTeams, setMaxTeams] = useState(1);
  const [maxTeamSize, setMaxTeamSize] = useState(1);
  const [minTeamSize, setMinTeamSize] = useState(1);
  const [status, setStatus] = useState("upcoming");
  const [phone, setPhone] = useState("");
  const [whatsappGroup, setWhatsappGroup] = useState("");

  const [timeline, setTimeline] = useState([{ title: "", description: "", date: "" }]);
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
  const [sponsors, setSponsors] = useState([{ name: "", logo: "" }]);
  const [customSections, setCustomSections] = useState([{ header: "", divs: [{ image: "", title: "" }] }]);

  // Helper function to format ISO date to "yyyy-MM-dd"
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0];
  };

  // Fetch event data when the component mounts
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/event/${id}`);
        const eventData = response.data;

        // Set state with fetched event data
        setBannerImage(eventData.bannerImage || "");
        setTitle(eventData.title || "");
        setDateOfConduct(formatDateForInput(eventData.dateOfConduct));
        setDescription(eventData.description || "");
        setLocation(eventData.location || "");
        setCity(eventData.city || "");
        setEventType(eventData.type || "event"); // Set eventType
        setPrizePool(eventData.prizePool || 0);
        setMaxTeams(eventData.maxTeams || 1);
        setMaxTeamSize(eventData.maxTeamSize || 1);
        setMinTeamSize(eventData.minTeamSize || 1);
        setStatus(eventData.status || "upcoming");
        setPhone(eventData.queries?.phone || "");
        setWhatsappGroup(eventData.queries?.whatsappGroup || "");
        setTimeline(eventData.timeline || [{ title: "", description: "", date: "" }]);
        setFaqs(eventData.faqs || [{ question: "", answer: "" }]);
        setSponsors(eventData.sponsors || [{ name: "", logo: "" }]);
        setCustomSections(eventData.customSections || [{ header: "", divs: [{ image: "", title: "" }] }]);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData();
  }, [id]);

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

  // Submit Updated Event Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = {
      bannerImage,
      title,
      dateOfConduct,
      description,
      location,
      city,
      type: eventType, // Include eventType
      prizePool: eventType === "hackathon" ? Number(prizePool) : undefined, // Only include for hackathons
      maxTeams: eventType === "hackathon" ? Number(maxTeams) : undefined,
      maxTeamSize: eventType === "hackathon" ? Number(maxTeamSize) : undefined,
      minTeamSize: eventType === "hackathon" ? Number(minTeamSize) : undefined,
      status,
      queries: { phone, whatsappGroup },
      timeline: eventType === "hackathon" ? timeline : undefined, // Only include for hackathons
      faqs,
      sponsors,
      customSections: eventType === "hackathon" ? customSections : undefined, // Only include for hackathons
    };

    try {
      await axios.put(`http://localhost:8080/api/events/${id}`, eventData);
      navigate(`/event/${id}`);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // Render Hackathon-specific fields
  const renderHackathonFields = () => {
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
              min="0"
            />
          </div>

          {/* Team Details */}
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

          {/* Custom Sections */}
          <div className="form-group">
            <h3>Custom Sections</h3>
            {customSections.map((section, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder="Header"
                  value={section.header}
                  onChange={(e) => {
                    const newSections = [...customSections];
                    newSections[index].header = e.target.value;
                    setCustomSections(newSections);
                  }}
                />
                {section.divs.map((div, divIndex) => (
                  <div key={divIndex}>
                    <input
                      type="text"
                      placeholder="Title"
                      value={div.title}
                      onChange={(e) => {
                        const newSections = [...customSections];
                        newSections[index].divs[divIndex].title = e.target.value;
                        setCustomSections(newSections);
                      }}
                    />
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileUpload(e, (url) => {
                          const newSections = [...customSections];
                          newSections[index].divs[divIndex].image = url;
                          setCustomSections(newSections);
                        })
                      }
                    />
                    {div.image && (
                      <img src={div.image} alt="Div Preview" width="100" />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const newSections = [...customSections];
                        newSections[index].divs.splice(divIndex, 1);
                        setCustomSections(newSections);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newSections = [...customSections];
                    newSections[index].divs.push({ image: "", title: "" });
                    setCustomSections(newSections);
                  }}
                >
                  + Add Div
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCustomSections(customSections.filter((_, i) => i !== index))
                  }
                >
                  Remove Section
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setCustomSections([
                  ...customSections,
                  { header: "", divs: [{ image: "", title: "" }] },
                ])
              }
            >
              + Add Custom Section
            </button>
          </div>

          {/* Timeline */}
          <div className="form-group">
            <h3>Timeline</h3>
            {timeline.map((item, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => {
                    const newTimeline = [...timeline];
                    newTimeline[index].title = e.target.value;
                    setTimeline(newTimeline);
                  }}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    const newTimeline = [...timeline];
                    newTimeline[index].description = e.target.value;
                    setTimeline(newTimeline);
                  }}
                />
                <input
                  type="date"
                  value={formatDateForInput(item.date)}
                  onChange={(e) => {
                    const newTimeline = [...timeline];
                    newTimeline[index].date = e.target.value;
                    setTimeline(newTimeline);
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setTimeline(timeline.filter((_, i) => i !== index))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setTimeline([...timeline, { title: "", description: "", date: "" }])
              }
            >
              + Add Timeline Event
            </button>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="create-event-container">
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        {/* Banner Image */}
        <div className="form-group">
          <label>Banner Image:</label>
          <input
            type="file"
            onChange={(e) => handleFileUpload(e, setBannerImage)}
          />
          {bannerImage && (
            <img src={bannerImage} alt="Banner Preview" width="200" />
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
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
              ],
            }}
            theme="snow"
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

        {/* Event Type */}
        <div className="form-group">
          <label>Event Type:</label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            required
          >
            <option value="event">Event</option>
            <option value="hackathon">Hackathon</option>
          </select>
        </div>

        {/* Render Hackathon-specific fields */}
        {renderHackathonFields()}

        {/* Status */}
        <div className="form-group">
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* FAQs */}
        <div className="form-group">
          <h3>FAQs</h3>
          {faqs.map((faq, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Question"
                value={faq.question}
                onChange={(e) => {
                  const newFaqs = [...faqs];
                  newFaqs[index].question = e.target.value;
                  setFaqs(newFaqs);
                }}
              />
              <textarea
                placeholder="Answer"
                value={faq.answer}
                onChange={(e) => {
                  const newFaqs = [...faqs];
                  newFaqs[index].answer = e.target.value;
                  setFaqs(newFaqs);
                }}
              />
              <button
                type="button"
                onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
          >
            + Add FAQ
          </button>
        </div>

        {/* Sponsors */}
        <div className="form-group">
          <h3>Sponsors</h3>
          {sponsors.map((sponsor, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Sponsor Name"
                value={sponsor.name}
                onChange={(e) => {
                  const newSponsors = [...sponsors];
                  newSponsors[index].name = e.target.value;
                  setSponsors(newSponsors);
                }}
              />
              <input
                type="file"
                onChange={(e) =>
                  handleFileUpload(e, (url) => {
                    const newSponsors = [...sponsors];
                    newSponsors[index].logo = url;
                    setSponsors(newSponsors);
                  })
                }
              />
              {sponsor.logo && (
                <img src={sponsor.logo} alt="Sponsor Logo" width="100" />
              )}
              <button
                type="button"
                onClick={() =>
                  setSponsors(sponsors.filter((_, i) => i !== index))
                }
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSponsors([...sponsors, { name: "", logo: "" }])}
          >
            + Add Sponsor
          </button>
        </div>

        {/* Contact Details */}
        <div className="form-group">
          <h3>Contact Details</h3>
          <label>Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <label>WhatsApp Group Link:</label>
          <input
            type="text"
            value={whatsappGroup}
            onChange={(e) => setWhatsappGroup(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Update Event</button>
      </form>
    </div>
  );
};

export default EditEvent;