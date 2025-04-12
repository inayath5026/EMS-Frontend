import React from "react";
import "./EventCustomSections.css";

const EventCustomSections = ({ customSections }) => (
  <>
    {customSections && customSections.length > 0 && (
      <>
        <h2>Custom Sections</h2>
        {customSections.map((section, index) => (
          <div key={index} className="custom-section">
            <h3>{section.header}</h3>
            <div className="custom-divs">
              {section.divs.map((div, divIndex) => (
                <div className="custom-div" key={divIndex}>
                  {div.image && <img src={div.image} alt={div.title} width="100" />}
                  <p>{div.title}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </>
    )}
  </>
);

export default EventCustomSections;