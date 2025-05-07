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
        logout(); 
        navigate('/'); 
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

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Header.css";

// const Header = () => {
//   const navigate = useNavigate();
//   const [scrolled, setScrolled] = useState(false);
  
//   // Demo auth state since we don't have actual auth context
//   const [user, setUser] = useState(null);
//   const loading = false;
  
//   const login = () => {
//     // Demo login function
//     setUser({ name: "User" });
//   };
  
//   const logout = () => {
//     // Demo logout function
//     setUser(null);
//     navigate('/');
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       const isScrolled = window.scrollY > 10;
//       if (isScrolled !== scrolled) {
//         setScrolled(isScrolled);
//       }
//     };

//     document.addEventListener('scroll', handleScroll);
//     return () => {
//       document.removeEventListener('scroll', handleScroll);
//     };
//   }, [scrolled]);

//   return (
//     <header className={`header ${scrolled ? 'scrolled' : ''}`}>
//       <div className="header-container">
//         <div className="logo-container">
//           <Link to="/" className="logo">HACKLY</Link>
//         </div>
        
//         <nav className="nav-links">
//           {user && (
//             <Link to="/create" className="nav-link">Create</Link>
//           )}
//           <Link to="/about" className="nav-link">About</Link>
//         </nav>
        
//         <div className="auth-container">
//           {!loading && (
//             user ? (
//               <button onClick={logout} className="auth-button logout">
//                 Logout
//               </button>
//             ) : (
//               <button onClick={login} className="auth-button login">
//                 Login
//               </button>
//             )
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
