import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/components/navbar.scss";

export const Navbar = () => {
	return (
		<nav className="_navbar">
			<NavLink className="_navbar-logo" to="/">
				Inicio
			</NavLink>
			<NavLink to="/calendar">Calendario</NavLink>
			<NavLink to="#">Productos</NavLink>
			<NavLink to="#">Servicios</NavLink>
			<NavLink to="#">Contacto</NavLink>
			<NavLink to="#" className="login-navlink">
				Entrar
			</NavLink>
		</nav>
	);
};
