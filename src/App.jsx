import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Added useAuth import
import EventsList from "./EventsList";
import Header from "./Header";
import About from "./About";
import Event from "./Event";
import CreateEvent from "./CreateEvent";
import EditEvent from "./EditEvent";
import CreateTicket from "./Ticket/CreateTicket";
import ShowTickets from "./Ticket/ShowTicket";
import EditTicket from "./Ticket/EditTicket";
import FormBuilder from "./RegistrationForm/FormBuilder";
import RegistrationForm from "./RegistrationForm/RegistrationForm";
import EventResponses from "./Dashboard/EventResponses";
import Payments from "./Dashboard/Payments";
import EditRegistrationForm from "./RegistrationForm/EditRegistrationForm";
import AuthSuccess from "./AuthSuccess";
import Login from "./Login";
import Verify from "./Verify";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<EventsList />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path="/event/:id" element={<Event />} />
          <Route path="/create" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />
          <Route path="/create-ticket/:id" element={<ProtectedRoute><CreateTicket /></ProtectedRoute>} />
          <Route path="/tickets/:eventId" element={<ProtectedRoute><ShowTickets /></ProtectedRoute>} />
          <Route path="/edit-ticket/:ticketId" element={<ProtectedRoute><EditTicket /></ProtectedRoute>} />
          <Route path="/create-form/:eventId" element={<ProtectedRoute><FormBuilder /></ProtectedRoute>} />
          <Route path="/register/:eventId" element={<RegistrationForm />} />
          <Route path="/events/:eventId/responses" element={<ProtectedRoute><EventResponses /></ProtectedRoute>} />
          <Route path="/payments/:eventId" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
          <Route path="/verify/:eventId" element={<ProtectedRoute><Verify /></ProtectedRoute>} />
          <Route path="/events/:eventId/edit-form/:formId" element={<ProtectedRoute><EditRegistrationForm /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default App;
