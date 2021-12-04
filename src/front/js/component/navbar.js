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
			<span>
				<NavLink to="/login" className="_navbar-login">
					Acceder
				</NavLink>
			</span>
		</nav>
	);
};
