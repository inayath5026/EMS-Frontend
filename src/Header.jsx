// import { Link } from "react-router";
// import "./Header.css"

// const Header = () => {
//   return (
//     <nav className="navbar">
//       <ul className="nav-list">
//         <li className="brand"><Link to="/">HACKLY</Link></li>
//         <li><Link to="/create">Create</Link></li>
//         <li><Link to="/about">About</Link></li>
//       </ul>
//     </nav>
//   );
// };

// export default Header;

// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";
// import "./Header.css";
// import axios from "axios";

// const Header = () => {
//   const { user, loading, login, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       const response = await axios.get('http://localhost:8080/auth/logout', {
//         withCredentials: true
//       });
      
//       if (response.data.success) {
//         logout(); // Update the auth context
//         navigate('/'); // Redirect to home page
//       } else {
//         console.error('Logout failed:', response.data.error);
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   return (
//     <nav className="navbar">
//       <ul className="nav-list">
//         <li className="brand"><Link to="/">HACKLY</Link></li>
//         {user && (
//           <li><Link to="/create">Create</Link></li>
//         )}
//         <li><Link to="/about">About</Link></li>
//       </ul>

//       <div className="auth-section">
//         {!loading && (
//           user ? (
//             <div className="user-info">
//               <span className="user-email">{user.email}</span>
//               <button onClick={handleLogout} className="logout-btn">
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <button onClick={login} className="login-btn">
//               Login with Google
//             </button>
//           )
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Header;

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./Header.css";
import axios from "axios";

const Header = () => {
  const { user, loading, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:8080/auth/logout', {
        withCredentials: true
      });
      
      if (response.data.success) {
        logout(); // Update the auth context
        navigate('/'); // Redirect to home page
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="brand"><Link to="/">HACKLY</Link></li>
        {user && (
          <li><Link to="/create">Create</Link></li>
        )}
        <li><Link to="/about">About</Link></li>
      </ul>

      <ul className="nav-list auth-section">
        {!loading && (
          user ? (
            <>
              <li className="user-email">{user.email}</li>
              <li>
                <Link to="#" onClick={handleLogout} className="nav-link">
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link to="#" onClick={login} className="nav-link">
                Login
              </Link>
            </li>
          )
        )}
      </ul>
    </nav>
  );
};

export default Header;