import React from 'react';
import './EventTimeline.css';

const EventTimeline = ({ timeline }) => {
  return (
    <div className="timeline-container">
      <div className="container">
        <h2 className="section-title">Event Timeline</h2>
        <p className="section-subtitle">Key milestones and important dates</p>
        
        <div className="timeline">
          <div className="timeline-line"></div>
          
          {timeline.map((item, index) => {
            const date = new Date(item.date);
            const formattedDate = date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            });
            
            return (
              <div 
                key={index}
                className={`timeline-item ${index % 2 === 0 ? 'timeline-right' : 'timeline-left'}`}
              >
                <div className="timeline-point"></div>
                <div className="timeline-card">
                  <div className="timeline-date">
                    <span className="timeline-icon">{item.icon || '📅'}</span>
                    {formattedDate}
                  </div>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-description">{item.description}</p>
                  {item.link && (
                    <a href={item.link} className="timeline-link" target="_blank" rel="noopener noreferrer">
                      Learn more →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventTimeline;