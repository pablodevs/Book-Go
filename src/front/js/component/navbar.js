import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/components/navbar.scss";

export const Navbar = () => {
	return (
		<nav className="navbar sticky-top">
			<div className="container d-flex">
				<NavLink to="/">
					<h4>Home</h4>
				</NavLink>
				<NavLink to="/calendar">
					<h5>calendar</h5>
				</NavLink>
			</div>
		</nav>
	);
};
