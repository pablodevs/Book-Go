import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../store/appContext.js";
import { NavLink } from "react-router-dom";
import "../../../styles/components/navbar.scss";

export const Navbar = () => {
	let [navMenu, setNavMenu] = useState(false);
	const { store, actions } = useContext(Context);

	useEffect(
		() => {
			if (navMenu || store.popup) {
				document.querySelector("html").style.position = "fixed";
				document.querySelector("html").style.overflowY = "scroll";
			} else {
				document.querySelector("html").style.position = "initial";
			}
		},
		[navMenu, store.popup]
	);

	return (
		<header>
			<nav className="_navbar">
				<span className="_navbar-logo-wrapper center">
					<NavLink className="_navbar-logo _navbar-link" to="/" onClick={() => setNavMenu(false)}>
						Inicio
					</NavLink>
				</span>
				{store.token ? (
					<div>
						<img
							src={store.img_url}
							alt="foto_perfil"
							style={{ width: "50px", borderRadius: "50%" }}
							className="m-2"
						/>
						<button
							className="_navbar-login"
							onClick={() => {
								actions.logout();
							}}>
							<div className="">
								<span>Salir </span>
								<i className="far fa-user" />
							</div>
						</button>
					</div>
				) : (
					<button
						className="_navbar-login"
						onClick={() => {
							actions.setPopup("login", "Iniciar Sesión");
							setNavMenu(false);
						}}>
						<div className="_navbar-login-effect">
							<span>Acceder</span>
							<i className="far fa-user" />
						</div>
					</button>
				)}

				<button className="_navbar-toggle" onClick={() => setNavMenu(!navMenu)}>
					{navMenu ? <i className="fas fa-times" /> : <i className="fas fa-bars" />}
				</button>
				<ul className={"_navbar-group" + (navMenu ? " _navbar-show" : "")}>
					<NavLink
						className="_navbar-link"
						to="#"
						onClick={() => {
							actions.setPopup("booking", "¿Qué estás buscando?");
							setNavMenu(false);
						}}>
						Reservar
					</NavLink>
					<NavLink className="_navbar-link" to="#" onClick={() => setNavMenu(false)}>
						Productos
					</NavLink>
					<NavLink className="_navbar-link" to="#" onClick={() => setNavMenu(false)}>
						Contacto
					</NavLink>
				</ul>
			</nav>
		</header>
	);
};
