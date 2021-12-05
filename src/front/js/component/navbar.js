import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/components/navbar.scss";

export const Navbar = () => {
	return (
		<nav className="_navbar">
			<NavLink className="_navbar-logo" to="/">
				Inicio
			</NavLink>
			<ul className="_navbar-group">
				<li className="_navbar-link">
					<NavLink to="/calendar">Reserva</NavLink>
				</li>
				<li className="_navbar-link">
					<NavLink to="#">Productos</NavLink>
				</li>
				<li className="_navbar-link">
					<NavLink to="#">Contacto</NavLink>
				</li>
			</ul>
			<button className="_navbar-login center">
				<div className="_navbar-login-effect">
					<span>Acceder</span>
					<i className="far fa-user" />
				</div>
			</button>
		</nav>
	);
};
