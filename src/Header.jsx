import { Link } from "react-router";
import "./Header.css"

const Header = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="brand"><Link to="/">HACKLY</Link></li>
        <li><Link to="/create">Create</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
};

export default Header;
