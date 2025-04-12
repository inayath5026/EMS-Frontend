import React from "react";

const CustomSections = ({ customSections, setCustomSections, handleFileUpload }) => {
  return (
    <div className="form-group">
      <h3>Custom Sections</h3>
      {customSections.map((section, index) => (
        <div key={index} className="custom-section">
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
            <div key={divIndex} className="custom-div">
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
                <img src={div.image} alt="Div Preview" className="div-preview" />
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
        className="add-button"
      >
        + Add Custom Section
      </button>
    </div>
  );
};

export default CustomSections;