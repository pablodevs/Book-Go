import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/components/navbar.scss";

export const Navbar = () => {
	let [menu, setMenu] = useState(false);
	return (
		<header>
			<nav className="_navbar">
				<span className="_navbar-logo-wrapper center">
					<NavLink className="_navbar-logo _navbar-link" to="/" onClick={() => setMenu(false)}>
						Inicio
					</NavLink>
				</span>
				<button className="_navbar-login" onClick={() => setMenu(false)}>
					<div className="_navbar-login-effect">
						<span>Acceder</span>
						<i className="far fa-user" />
					</div>
				</button>
				<button className="_navbar-toggle" onClick={() => setMenu(!menu)}>
					{menu ? <i className="fas fa-times" /> : <i className="fas fa-bars" />}
				</button>
				<ul className={"_navbar-group" + (menu ? " _navbar-show" : "")}>
					<NavLink className="_navbar-link" to="/calendar" onClick={() => setMenu(false)}>
						Reserva
					</NavLink>
					<NavLink className="_navbar-link" to="#" onClick={() => setMenu(false)}>
						Productos
					</NavLink>
					<NavLink className="_navbar-link" to="#" onClick={() => setMenu(false)}>
						Contacto
					</NavLink>
				</ul>
			</nav>
		</header>
	);
};
