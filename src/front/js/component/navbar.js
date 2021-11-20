import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link className="btn" to="/">
					<span className="navbar-brand mb-0 h1">Link</span>
				</Link>
			</div>
		</nav>
	);
};
