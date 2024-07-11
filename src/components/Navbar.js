import React from "react";
import { Link, useLocation,useNavigate} from "react-router-dom";

export default function Navbar(props) {
  let location = useLocation();
  let navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    props.showalert("Logged Out","success")
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="#">
            myNotebook
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/about" ? "active" : ""
                  }`}
                  to="/about"
                >
                  About
                </Link>
              </li>
            </ul>
            {!localStorage.getItem('token') ? (
            <form className="d-flex">
              <Link className="btn btn-warning mx-2" role="button" to="/login">Login</Link>
              <Link className="btn btn-warning mx-2" role="button" to="/signup">Sign Up</Link>
            </form>
          ) : (
            <button type="button" className="btn btn-warning" onClick={handleLogout}>Log Out</button>
          )}
          </div>
        </div>
      </nav>
    </>
  );
}
