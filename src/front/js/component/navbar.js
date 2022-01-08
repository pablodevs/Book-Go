import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext.js";
import { Link, NavLink, useHistory } from "react-router-dom";
import "../../styles/components/navbar.scss";

export const Navbar = () => {
	let [navMenu, setNavMenu] = useState(false);
	const { store, actions } = useContext(Context);

	let history = useHistory();

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

	useEffect(
		() => {
			if (store.user.is_admin) history.push("/admin");
		},
		[store.user.is_admin]
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
					<Link to={store.user.is_admin ? "/admin" : "/dashboard"}>
						{store.user.img_url ? (
							<img
								className="_navbar-profile-img"
								src={store.user.img_url}
								alt="foto_perfil"
								width="30"
								height="30"
							/>
						) : (
							<div className="avatar avatar-miniature">
								<svg viewBox="0 0 24 24" className="avatar__img">
									<path
										d="M12,3.5c2.347,0,4.25,1.903,4.25,4.25S14.347,12,12,12s-4.25-1.903-4.25-4.25S9.653,3.5,12,3.5z
                                M5,20.5
                                c0-3.866,3.134-7,7-7s7,3.134,7,7H5z"
									/>
								</svg>
							</div>
						)}
					</Link>
				) : (
					<button
						className="_navbar-login btn-cool"
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
							actions.calendarActions.changeHoursView("01/01/2000");
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
