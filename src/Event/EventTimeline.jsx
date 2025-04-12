import React from "react";
import "./EventTimeline.css"; // Import CSS file

const Timeline = ({ timeline }) => {
    return (
        <div className="timeline-container">
            <h2 className="timeline-title">Event Timeline</h2>
            <div className="timeline">
                {timeline.map((item, index) => (
                    <div key={index} className="timeline-item">
                        <div className="timeline-content">
                            <h3>{item.title}</h3>
                            <p className="timeline-date">
                                {new Date(item.date).toDateString()}
                            </p>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;
