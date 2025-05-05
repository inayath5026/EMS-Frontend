// import React from "react";
// import "./EventContact.css";

// const EventContact = ({ queries }) => (
//   <div className="event-contact">
//     <h2>Contact</h2>
//     <p>Phone: {queries?.phone || "Not Available"}</p>
//     <p>
//       WhatsApp Group:{" "}
//       {queries?.whatsappGroup ? (
//         <a href={queries.whatsappGroup} target="_blank" rel="noopener noreferrer">
//           Join
//         </a>
//       ) : (
//         "Not Available"
//       )}
//     </p>
//   </div>
// );

// export default EventContact;


import React from 'react';
import './EventContact.css';

const EventContact = ({ queries }) => {
  const { phone, whatsappGroup } = queries || {};
  
  if (!phone && !whatsappGroup) return null;
  
  return (
    <div className="contact-container">
      <div className="container">
        <h2 className="section-title text-gradient">Contact Us</h2>
        
        <div className="contact-cards">
          {phone && (
            <div className="contact-card glass-card">
              <div className="contact-icon">
                📞
              </div>
              <h3 className="contact-title">Phone Support</h3>
              <p className="contact-description">Have questions? Call us directly</p>
              <a 
                href={`tel:${phone}`} 
                className="contact-link"
              >
                {phone}
              </a>
            </div>
          )}
          
          {whatsappGroup && (
            <div className="contact-card glass-card">
              <div className="contact-icon">
                💬
              </div>
              <h3 className="contact-title">WhatsApp Group</h3>
              <p className="contact-description">Join our community for updates</p>
              <a 
                href={whatsappGroup} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-link"
              >
                Join WhatsApp Group
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventContact;
