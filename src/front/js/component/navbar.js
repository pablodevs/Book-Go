import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext.js";
import { Link, NavLink } from "react-router-dom";
import "../../styles/components/navbar.scss";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	let [navMenu, setNavMenu] = useState(false);
	const [servicesNavlink, setServicesNavlink] = useState(true);

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

	const url = window.location.pathname.split("/").pop();
	useEffect(
		() => {
			if (window.location.pathname !== "/") setServicesNavlink(false);
			else setServicesNavlink(true);
		},
		[url]
	);

	return (
		<header>
			<nav className="_navbar">
				<span className="_navbar-logo-wrapper text-start">
					<NavLink
						className="_navbar-logo _navbar-link"
						to="/"
						onClick={() => {
							document.body.scrollTop = 0;
							document.documentElement.scrollTop = 0;
							setNavMenu(false);
							setServicesNavlink(true);
						}}>
						Inicio
					</NavLink>
				</span>
				{store.token ? (
					<Link
						to={store.user.is_admin ? "/admin/welcome" : "/dashboard/welcome"}
						className="_navbar-profile-wrapper">
						<div>
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
						</div>
						<div>
							<span>Perfil</span>
							<i className="fas fa-chevron-down" />
						</div>
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
						}}>
						Reservar
					</NavLink>
					{servicesNavlink ? (
						<a className="_navbar-link" href="#services" onClick={() => setNavMenu(false)}>
							Servicios
						</a>
					) : null}
					{/* <NavLink className="_navbar-link" to="#" onClick={() => setNavMenu(false)}>
						Contacto
					</NavLink> */}
				</ul>
			</nav>
		</header>
	);
};
