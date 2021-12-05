import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/components/navbar.scss";

export const Navbar = () => {
	return (
		<nav className="_navbar">
			<NavLink className="_navbar-logo" to="/">
				Inicio
			</NavLink>
			<NavLink to="/calendar">Reserva</NavLink>
			<NavLink to="#">Productos</NavLink>
			<NavLink to="#">Contacto</NavLink>
			<div className="_navbar-login center">
				<NavLink to="/login">
					<div className="_navbar-login-effect">
						<span>Acceder</span>
						<i className="far fa-user" />
					</div>
				</NavLink>
			</div>
		</nav>
	);
};
