import { useState } from "react";
import "./Faqs.css"; // Import styles

const Faqs = ({ faqs }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="faq-container">
            <h2>Frequently Asked Questions</h2>
            {faqs.map((faq, index) => (
                <div 
                    key={index} 
                    className={`faq-item ${activeIndex === index ? "active" : ""}`}
                    onClick={() => toggleFAQ(index)}
                >
                    <p className="faq-question">
                        Q: {faq.question}
                        <span className="faq-toggle">{activeIndex === index ? "−" : "+"}</span>
                    </p>
                    <p className="faq-answer">{faq.answer}</p>
                </div>
            ))}
        </div>
    );
};

export default Faqs;
