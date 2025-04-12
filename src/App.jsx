import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventsList from "./EventsList";
import Header from "./Header";
import About from "./About";
import Event from "./Event";
import CreateEvent from "./CreateEvent";
import EditEvent from "./EditEvent";
import CreateTicket from "./Ticket/CreateTicket";
import ShowTickets from "./Ticket/ShowTicket";
import EditTicket from "./Ticket/EditTicket";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<EventsList />} />
        <Route path="/about" element={<About />} />
        <Route path="/event/:id" element={<Event/>} />
        <Route path="/create" element={<CreateEvent/>} />
        <Route path="/edit/:id" element={<EditEvent/>} />
        <Route path="/create-ticket/:id" element={< CreateTicket/>} />
        <Route path="/tickets/:eventId" element={<ShowTickets />} />
        <Route path="/edit-ticket/:ticketId" element={<EditTicket/>} />
      </Routes>
    </Router>
  );
}

export default App;


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./auth/AuthContext";
// import { ProtectedRoute } from "./auth/ProtectedRoute";
// import EventsList from "./EventsList";
// import Header from "./Header";
// import About from "./About";
// import Event from "./Event";
// import CreateEvent from "./CreateEvent";
// import EditEvent from "./EditEvent";
// import CreateTicket from "./Ticket/CreateTicket";
// import ShowTickets from "./Ticket/ShowTicket";
// import EditTicket from "./Ticket/EditTicket";
// import Login from "./pages/Login";

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <Header />
//         <Routes>
//           {/* Public routes */}
//           <Route path="/" element={<EventsList />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/event/:id" element={<Event />} />
//           <Route path="/tickets/:eventId" element={<ShowTickets />} />
//           <Route path="/login" element={<Login />} />

//           {/* Protected routes */}
//           <Route path="/create" element={
//             <ProtectedRoute>
//               <CreateEvent />
//             </ProtectedRoute>
//           } />

//           <Route path="/edit/:id" element={
//             <ProtectedRoute>
//               <EditEvent />
//             </ProtectedRoute>
//           } />

//           <Route path="/create-ticket/:id" element={
//             <ProtectedRoute>
//               <CreateTicket />
//             </ProtectedRoute>
//           } />

//           <Route path="/edit-ticket/:ticketId" element={
//             <ProtectedRoute>
//               <EditTicket />
//             </ProtectedRoute>
//           } />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;