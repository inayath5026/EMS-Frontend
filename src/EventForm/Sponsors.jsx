import React from "react";

const Sponsors = ({ sponsors, setSponsors, handleFileUpload }) => {
  return (
    <div className="form-group">
      <h3>Sponsors</h3>
      {sponsors.map((sponsor, index) => (
        <div key={index} className="sponsor-section">
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
            <img src={sponsor.logo} alt="Sponsor Logo" className="logo-preview" />
          )}
          <button
            type="button"
            onClick={() => setSponsors(sponsors.filter((_, i) => i !== index))}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setSponsors([...sponsors, { name: "", logo: "" }])}
        className="add-button"
      >
        + Add Sponsor
      </button>
    </div>
  );
};

export default Sponsors;
