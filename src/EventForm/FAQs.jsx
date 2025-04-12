import React from "react";

const FAQs = ({ faqs, setFaqs }) => {
  return (
    <div className="form-group">
      <h3>FAQs</h3>
      {faqs.map((faq, index) => (
        <div key={index} className="faq-section">
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
        className="add-button"
      >
        + Add FAQ
      </button>
    </div>
  );
};

export default FAQs;
