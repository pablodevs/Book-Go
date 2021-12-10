import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../store/appContext.js";
import { NavLink } from "react-router-dom";
import { Popup } from "./popup.js";
import "../../../styles/components/navbar.scss";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	let [navMenu, setNavMenu] = useState(false);

	useEffect(
		() => {
			if (window.innerWidth <= 767.9 && (navMenu || store.popup)) {
				document.body.style.overflowY = "hidden"; //⚠️ERROR⚠️ cuando agrandas el tamaño de la pantalla y pasas a > 767.9, no se puede hacer 'scroll'
			} else {
				document.body.style.overflowY = "scroll";
			}
		},
		[navMenu, store.popup]
	);

	return (
		<header>
			<nav className="_navbar">
				<span className="_navbar-logo-wrapper center">
					<NavLink
						className="_navbar-logo _navbar-link"
						to="/"
						onClick={() => {
							setNavMenu(false);
							actions.closePopup();
						}}>
						Inicio
					</NavLink>
				</span>
				<button
					className="_navbar-login"
					onClick={() => {
						actions.setPopup("login");
						setNavMenu(false);
					}}>
					<div className="_navbar-login-effect">
						<span>Acceder</span>
						<i className="far fa-user" />
					</div>
				</button>
				<button className="_navbar-toggle" onClick={() => setNavMenu(!navMenu)}>
					{navMenu ? <i className="fas fa-times" /> : <i className="fas fa-bars" />}
				</button>
				<ul className={"_navbar-group" + (navMenu ? " _navbar-show" : "")}>
					<NavLink
						className="_navbar-link"
						to="#"
						onClick={() => {
							actions.setPopup("booking");
							setNavMenu(false);
						}}>
						Reserva
					</NavLink>
					<NavLink
						className="_navbar-link"
						to="#"
						onClick={() => {
							setNavMenu(false);
							actions.closePopup();
						}}>
						Productos
					</NavLink>
					<NavLink
						className="_navbar-link"
						to="#"
						onClick={() => {
							setNavMenu(false);
							actions.closePopup();
						}}>
						Contacto
					</NavLink>
				</ul>
			</nav>

			{store.popup === "booking" ? (
				<Popup type={store.popup} title="¿Qué estás buscando?" />
			) : store.popup === "login" ? (
				<Popup type={store.popup} title="Iniciar Sesión" />
			) : store.popup === "signup" ? (
				<Popup type={store.popup} title="Únete" />
			) : null}
		</header>
	);
};
