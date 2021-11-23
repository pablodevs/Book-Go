import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-dark bg-dark sticky-top">
			<div className="container d-flex">
				<Link to="/" className="text-light">
					<h4>Home</h4>
				</Link>
			</div>
		</nav>
	);
};
