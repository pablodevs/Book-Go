import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/components/navbar.scss";

export const Navbar = () => {
	return (
		<nav className="_navbar">
			<NavLink className="navbar-logo" to="/">
				Home
			</NavLink>
			<NavLink to="/calendar">Calendar</NavLink>
			<NavLink to="#">AnotherLink</NavLink>
		</nav>
	);
};
