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
   <Link to="/">  <img src={logo} width="100px" className="ght"/></Link>
      <div className="searchbar">
        <img  src={favicon} />
      <input
        type="text"
        placeholder="Oque quer jogar hoje..."
        value={query}
        onChange={handleSearch}
        className="search-bar"
      />
      </div>
      
      {NavbarData.map((val, key) => (
        <NavLink
          className="text-[green]"
          to={val.link}
          key={key}
          activeClassName="active"
        >
       {val.icon}
        </NavLink>
      ))}
    </div>
  );
}

export default Navbar;

