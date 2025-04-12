import React from "react";
import "./EventSponsors.css";

const EventSponsors = ({ sponsors }) => (
  <>
    {sponsors && sponsors.length > 0 && (
      <>
        <h2>Sponsors</h2>
        <div className="sponsors-container">
          {sponsors.map((sponsor, index) => (
            <div className="sponsor-card" key={index}>
              <img src={sponsor.logo} alt={sponsor.name} />
              <p>{sponsor.name}</p>
            </div>
          ))}
        </div>
      </>
    )}
  </>
);

export default EventSponsors;