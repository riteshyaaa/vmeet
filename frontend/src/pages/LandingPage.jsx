import React from "react";
import { Link } from "react-router-dom";

export const LandingPage = () => {
  return (
    <div className="landingPageContainer">
      <nav className="navbar">
        <div className="navbarHeader">
          <h2>VMeet Calling</h2>{" "}
        </div>
        <div className="navbarList">
          <ul>
            <li className="navItems">
              <Link to="/">Join as Guest</Link>
            </li>
            <li className="navItems">
              <Link to="/auth">Register</Link>
            </li>
            <li className="navItems">
              <Link to="/auth">Login</Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="landingMainContainer">
        <div>
          <h2>
            <span style={{ color: "#f2a942ff" }}>Connect </span>with your loved
            Ones
          </h2>
          <p>Cover a distance by VMeet video call </p>
          <div role="button">
            <Link to="/auth">Get Started</Link>
          </div>
        </div>
        <div>
          <img src="/public/mobile.png" />
        </div>
      </div>
    </div>
  );
};
