// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import './EventResponses.css';

// const EventResponses = () => {
//   const { eventId } = useParams();
//   const [responses, setResponses] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('responses');

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       setError(null);
      
//       try {
//         const [resResponse, statsResponse] = await Promise.all([
//           axios.get(`http://localhost:8080/api/events/${eventId}/responses`),
//           axios.get(`http://localhost:8080/api/events/${eventId}/responses/stats`, {
//             validateStatus: (status) => status < 500 // Don't reject for 404
//           })
//         ]);
        
//         setResponses(resResponse.data?.data || []);
        
//         // Handle stats response differently since it might 404 if no responses exist
//         if (statsResponse.status === 200) {
//           setStats(statsResponse.data?.data || {
//             totalResponses: 0,
//             byDevice: [],
//             byDate: []
//           });
//         } else {
//           setStats({
//             totalResponses: 0,
//             byDevice: [],
//             byDate: []
//           });
//         }
//       } catch (err) {
//         setError(err.response?.data?.message || 
//                 err.message || 
//                 'Failed to load response data');
//         console.error('Fetch error:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [eventId]);

//   const formatDate = (dateString) => {
//     try {
//       return new Date(dateString).toLocaleString();
//     } catch {
//       return 'Unknown date';
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner"></div>
//         <p>Loading responses...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error-container">
//         <h3>Error Loading Data</h3>
//         <p>{error}</p>
//         <button 
//           className="retry-button"
//           onClick={() => window.location.reload()}
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="event-responses-container">
//       <h2>Event Responses</h2>
      
//       <div className="tabs">
//         <button 
//           className={`tab-button ${activeTab === 'responses' ? 'active' : ''}`}
//           onClick={() => setActiveTab('responses')}
//         >
//           All Responses ({responses.length})
//         </button>
//         <button 
//           className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
//           onClick={() => setActiveTab('stats')}
//         >
//           Statistics
//         </button>
//       </div>

//       {activeTab === 'responses' && (
//         <div className="responses-list">
//           {responses.length > 0 ? (
//             responses.map((response) => (
//               <div key={response._id} className="response-card">
//                 <div className="response-header">
//                   <h3>Response ID: {response._id}</h3>
//                   <span className="response-meta">
//                     Submitted on: {formatDate(response.createdAt)} | 
//                     Device: {response.metadata?.deviceType || 'Unknown'} | 
//                     Duration: {response.metadata?.duration || 'N/A'}s
//                   </span>
//                 </div>
                
//                 {response.formId && (
//                   <div className="form-info">
//                     <h4>Form: {response.formId.title}</h4>
//                     {response.formId.description && <p>{response.formId.description}</p>}
//                   </div>
//                 )}

//                 <div className="answers-section">
//                   <h4>Answers:</h4>
//                   {response.answers?.map((answer, idx) => (
//                     <div key={`${response._id}-${idx}`} className="answer-item">
//                       <strong>{answer.questionText}</strong>
//                       <div className="answer-value">
//                         {Array.isArray(answer.value) ? (
//                           <ul>
//                             {answer.value.map((item, i) => (
//                               <li key={`${response._id}-${idx}-${i}`}>{item}</li>
//                             ))}
//                           </ul>
//                         ) : (
//                           <span>{answer.value || 'Not answered'}</span>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="empty-state">
//               <p>No responses found for this event</p>
//             </div>
//           )}
//         </div>
//       )}

//       {activeTab === 'stats' && (
//         <div className="stats-container">
//           <div className="stat-card">
//             <h3>Total Responses</h3>
//             <p className="stat-value">{stats?.totalResponses || 0}</p>
//           </div>

//           <div className="stat-card">
//             <h3>By Device Type</h3>
//             {stats?.byDevice?.length > 0 ? (
//               <ul className="device-stats">
//                 {stats.byDevice.map((device, idx) => (
//                   <li key={`device-${idx}`}>
//                     <span className="device-name">
//                       {device.deviceType || device._id || 'Unknown'}:
//                     </span>
//                     <span className="device-count">{device.count}</span>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="no-data">No device data available</p>
//             )}
//           </div>

//           <div className="stat-card">
//             <h3>Responses Over Time</h3>
//             {stats?.byDate?.length > 0 ? (
//               <ul className="date-stats">
//                 {stats.byDate.map((date, idx) => (
//                   <li key={`date-${idx}`}>
//                     <span className="date">{date.date || date._id}:</span>
//                     <span className="count">{date.count}</span>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="no-data">No timeline data available</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EventResponses;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './EventResponses.css';

const EventResponses = () => {
  const { eventId } = useParams();
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedResponse, setExpandedResponse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`http://localhost:8080/api/events/${eventId}/responses`);
        setResponses(response.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 
                err.message || 
                'Failed to load response data');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const toggleResponse = (responseId) => {
    setExpandedResponse(expandedResponse === responseId ? null : responseId);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Unknown date';
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading responses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Data</h3>
        <p>{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="event-responses-container">
      <h2>Event Responses</h2>
      
      {responses.length > 0 ? (
        <div className="responses-list">
          {responses.map((response) => (
            <div key={response._id} className="response-card">
              <div 
                className="response-header"
                onClick={() => toggleResponse(response._id)}
              >
                <div className="submitter-info">
                  <span className="submitter-name">{response.submittedBy || 'Anonymous'}</span>
                  <span className="submission-date">{formatDate(response.createdAt)}</span>
                </div>
                <button className="toggle-button">
                  {expandedResponse === response._id ? '−' : '+'}
                </button>
              </div>
              
              {expandedResponse === response._id && (
                <div className="response-details">
                  <div className="metadata">
                    <span>Device: {response.metadata?.deviceType || 'Unknown'}</span>
                    <span>Duration: {response.metadata?.duration || 'N/A'}s</span>
                  </div>
                  
                  {response.formId && (
                    <div className="form-info">
                      <h4>Form: {response.formId.title}</h4>
                      {response.formId.description && <p>{response.formId.description}</p>}
                    </div>
                  )}

                  <div className="answers-section">
                    <h4>Answers:</h4>
                    {response.answers?.map((answer, idx) => (
                      <div key={`${response._id}-${idx}`} className="answer-item">
                        <strong>{answer.questionText}</strong>
                        <div className="answer-value">
                          {Array.isArray(answer.value) ? (
                            <ul>
                              {answer.value.map((item, i) => (
                                <li key={`${response._id}-${idx}-${i}`}>{item}</li>
                              ))}
                            </ul>
                          ) : (
                            <span>{answer.value || 'Not answered'}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No responses found for this event</p>
        </div>
      )}
    </div>
  );
};

export default EventResponses;