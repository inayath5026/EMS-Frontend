import React from "react";

const Timeline = ({ timeline, setTimeline }) => {
  return (
    <div className="form-group">
      <h3>Timeline</h3>
      {timeline.map((item, index) => (
        <div key={index} className="timeline-section">
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
            value={item.date}
            onChange={(e) => {
              const newTimeline = [...timeline];
              newTimeline[index].date = e.target.value;
              setTimeline(newTimeline);
            }}
          />
          <button
            type="button"
            onClick={() => setTimeline(timeline.filter((_, i) => i !== index))}
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
        className="add-button"
      >
        + Add Timeline Event
      </button>
    </div>
  );
};

export default Timeline;