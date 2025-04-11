import React, { useState } from "react";
import { NavbarData } from "./NavbarData";
import { Link, NavLink } from "react-router-dom";
import favicon from '../imgs/ChatGPT_Image_9_04_2025__13_54_52-removebg-preview.png'
import logo from '../imgs/logo.png'

function Navbar({ setSearchQuery }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setSearchQuery(e.target.value);
  };

  return (
    <div className="navbar">
      <Link to="/" className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      <div className="searchbar">
        <img src={favicon} alt="Search icon" className="search-icon" />
        <input
          type="text"
          placeholder="O que quer jogar hoje..."
          value={query}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <div className="nav-links">
        {NavbarData.map((val, key) => (
          <NavLink
            to={val.link}
            key={key}
            className="nav-link"
            activeClassName="active"
          >
            {val.icon}
          </NavLink>
        ))}
      </div>

      <style jsx>{`
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          background: rgba(19, 20, 30, 0.8);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 10px;
          z-index: 1000;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }

        .logo-container {
          transition: transform 0.3s ease;
        }

        .logo-container:hover {
          transform: scale(1.05);
        }

        .logo {
          width: 100px;
          height: auto;
        }

        .searchbar {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2rem;
          padding: 0.5rem 1rem;
          width: 40%;
          transition: all 0.3s ease;
        }

        .searchbar:focus-within {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(104, 66, 255, 0.2);
        }

        .search-icon {
          width: 20px;
          height: 20px;
          margin-right: 0.5rem;
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }

        .searchbar:focus-within .search-icon {
          opacity: 1;
        }

        .search-input {
          background: transparent;
          border: none;
          color: white;
          width: 100%;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .search-input:focus {
          outline: none;
        }

        .nav-links {
          display: flex;
          gap: 1.5rem;
        }

        .nav-link {
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
          position: relative;
          padding: 0.5rem;
        }

        .nav-link:hover {
          color: white;
          transform: translateY(-2px);
        }

        .nav-link.active {
          color: #6842ff;
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #6842ff;
          border-radius: 2px;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 1rem;
          }

          .searchbar {
            width: 50%;
          }

          .nav-links {
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Navbar;

