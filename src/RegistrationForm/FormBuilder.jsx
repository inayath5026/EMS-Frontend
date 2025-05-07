import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './FormBuilder.css';

const FormBuilder = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    fieldType: 'short-answer',
    options: [],
    required: false
  });

  const [currentOption, setCurrentOption] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Form title is required';
    }
    
    if (formData.questions.length === 0) {
      errors.questions = 'At least one question is required';
    } else {
      formData.questions.forEach((q, index) => {
        if (!q.questionText.trim()) {
          errors[`question-${index}`] = 'Question text cannot be empty';
        }
        if (['multiple-choice', 'checkboxes', 'dropdown'].includes(q.fieldType) && q.options.length < 2) {
          errors[`question-options-${index}`] = 'At least two options are required';
        }
      });
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleQuestionChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setCurrentQuestion(prev => {
      const updatedQuestion = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      
      if (name === 'fieldType' && !['multiple-choice', 'checkboxes', 'dropdown'].includes(value)) {
        updatedQuestion.options = [];
      }
      
      return updatedQuestion;
    });
  };

  const handleOptionChange = (e) => {
    setCurrentOption(e.target.value);
  };

  const addOption = () => {
    if (currentOption.trim()) {
      const newOption = {
        text: currentOption,
        value: currentOption.toLowerCase().replace(/\s+/g, '-')
      };
      setCurrentQuestion(prev => ({
        ...prev,
        options: [...prev.options, newOption]
      }));
      setCurrentOption('');
    }
  };

  const removeOption = (index) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const addQuestion = () => {
    if (currentQuestion.questionText.trim()) {
      if (['multiple-choice', 'checkboxes', 'dropdown'].includes(currentQuestion.fieldType) && 
          currentQuestion.options.length < 2) {
        alert('Please add at least two options for this question type');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, currentQuestion]
      }));
      
      setCurrentQuestion({
        questionText: '',
        fieldType: 'short-answer',
        options: [],
        required: false
      });
      
      if (formErrors.questions) {
        setFormErrors(prev => ({ ...prev, questions: undefined }));
      }
    }
  };

  const editQuestion = (index) => {
    const questionToEdit = formData.questions[index];
    setCurrentQuestion(questionToEdit);
    removeQuestion(index);
  };

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus(null);
    setIsSubmitting(true);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/events/${eventId}/forms`, 
        {
          title: formData.title,
          description: formData.description,
          questions: formData.questions,
          eventId
        }
      );

      setSubmissionStatus({ 
        success: true, 
        message: 'Form successfully created!',
        formData: response.data.data
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        questions: []
      });

    } catch (error) {
      console.error('Error creating form:', error);
      setSubmissionStatus({ 
        success: false, 
        message: error.response?.data?.message || 'Failed to create form' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionStatus?.success) {
    return (
      <div className="form-builder-container">
        <div className="success-message">
          <h2>Form Successfully Created!</h2>
          <p>{submissionStatus.message}</p>
          <div className="form-details">
            <h3>Form Details:</h3>
            <p><strong>Title:</strong> {submissionStatus.formData.title}</p>
            <p><strong>Description:</strong> {submissionStatus.formData.description || 'None'}</p>
            <p><strong>Number of Questions:</strong> {submissionStatus.formData.questions.length}</p>
          </div>
          <button 
            className="back-btn"
            onClick={() => navigate(`/event/${eventId}/`)}
          >
            Explore Created Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-builder-container">
      <h2>Create New Registration Form for Event #{eventId}</h2>
      
      {submissionStatus && !submissionStatus.success && (
        <div className="alert error">
          {submissionStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-form">
        <div className="form-group">
          <label>Form Title: *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            required
          />
          {formErrors.title && <span className="error-text">{formErrors.title}</span>}
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
          />
        </div>

        <div className="questions-section">
          <h3>Questions {formErrors.questions && <span className="error-text">- {formErrors.questions}</span>}</h3>
          
          {formData.questions.length === 0 ? (
            <p className="no-questions">No questions added yet</p>
          ) : (
            <div className="questions-list">
              {formData.questions.map((q, qIndex) => (
                <div key={qIndex} className="question-item">
                  <div className="question-header">
                    <span className="question-text">
                      {qIndex + 1}. {q.questionText} 
                      <span className="question-type">({q.fieldType})</span>
                      {q.required && <span className="required-flag">*</span>}
                    </span>
                    <div className="question-actions">
                      <button 
                        type="button" 
                        className="edit-btn"
                        onClick={() => editQuestion(qIndex)}
                        title="Edit question"
                      >
                        Edit
                      </button>
                      <button 
                        type="button" 
                        className="delete-btn"
                        onClick={() => removeQuestion(qIndex)}
                        title="Remove question"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  {formErrors[`question-${qIndex}`] && (
                    <div className="error-text">{formErrors[`question-${qIndex}`]}</div>
                  )}
                  {formErrors[`question-options-${qIndex}`] && (
                    <div className="error-text">{formErrors[`question-options-${qIndex}`]}</div>
                  )}
                  {q.options.length > 0 && (
                    <div className="options-list">
                      <strong>Options:</strong>
                      <ul>
                        {q.options.map((opt, optIndex) => (
                          <li key={optIndex}>{opt.text}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="new-question">
            <h4>{currentQuestion.questionText ? 'Edit Question' : 'Add New Question'}</h4>
            <div className="form-group">
              <label>Question Text: *</label>
              <input
                type="text"
                name="questionText"
                value={currentQuestion.questionText}
                onChange={handleQuestionChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Question Type:</label>
              <select
                name="fieldType"
                value={currentQuestion.fieldType}
                onChange={handleQuestionChange}
              >
                <option value="short-answer">Short Answer</option>
                <option value="paragraph">Paragraph</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="checkboxes">Checkboxes</option>
                <option value="dropdown">Dropdown</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="required"
                  checked={currentQuestion.required}
                  onChange={handleQuestionChange}
                />
                Required
              </label>
            </div>

            {['multiple-choice', 'checkboxes', 'dropdown'].includes(currentQuestion.fieldType) && (
              <div className="options-section">
                <h5>Options (minimum 2 required)</h5>
                {currentQuestion.options.length > 0 && (
                  <ul className="current-options">
                    {currentQuestion.options.map((opt, optIndex) => (
                      <li key={optIndex}>
                        {opt.text}
                        <button 
                          type="button"
                          className="delete-btn small"
                          onClick={() => removeOption(optIndex)}
                          title="Remove option"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="add-option">
                  <input
                    type="text"
                    value={currentOption}
                    onChange={handleOptionChange}
                    placeholder="Enter option text"
                    onKeyPress={(e) => e.key === 'Enter' && addOption()}
                  />
                  <button 
                    type="button" 
                    className="add-btn"
                    onClick={addOption}
                    disabled={!currentOption.trim()}
                  >
                    Add Option
                  </button>
                </div>
              </div>
            )}

            <button 
              type="button" 
              className="add-btn primary"
              onClick={addQuestion}
              disabled={!currentQuestion.questionText.trim()}
            >
              {currentQuestion.questionText ? 'Add Question' : 'Add Question to Form'}
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate(`/events/${eventId}/forms`)}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn primary"
            disabled={formData.questions.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Form'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormBuilder;