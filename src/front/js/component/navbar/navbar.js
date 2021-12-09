import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../store/appContext.js";
import { NavLink } from "react-router-dom";
import { BookingPopup } from "./bookingpopup.js";
import { LoginPopup } from "./loginpopup.js";
import "../../../styles/components/navbar.scss";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	let [menu, setMenu] = useState(false);

	useEffect(
		() => {
			if ((menu || store.navbarBooking) && window.innerWidth <= 767.9) {
				document.body.style.overflowY = "hidden";
			} else {
				document.body.style.overflowY = "scroll";
			}
		},
		[menu, store.navbarBooking]
	);

	return (
		<header>
			<nav className="_navbar">
				<span className="_navbar-logo-wrapper center">
					<NavLink className="_navbar-logo _navbar-link" to="/" onClick={() => setMenu(false)}>
						Inicio
					</NavLink>
				</span>
				<button
					className="_navbar-login"
					onClick={() => {
						actions.setBool("navbarLogin");
						actions.setBool("navbarBooking", "close");
						setMenu(false);
					}}>
					<div className="_navbar-login-effect">
						<span>Acceder</span>
						<i className="far fa-user" />
					</div>
				</button>
				<button className="_navbar-toggle" onClick={() => setMenu(!menu)}>
					{menu ? <i className="fas fa-times" /> : <i className="fas fa-bars" />}
				</button>
				<ul className={"_navbar-group" + (menu ? " _navbar-show" : "")}>
					<NavLink
						className="_navbar-link"
						to="#"
						onClick={() => {
							actions.setBool("navbarLogin", "close");
							actions.setBool("navbarBooking");
							setMenu(false);
						}}>
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

			{store.navbarBooking ? <BookingPopup /> : null}
			{store.navbarLogin ? <LoginPopup /> : null}
			<div
				className="month-blur-effect"
				style={{ left: `${store.mouseEffect.X}px`, top: `${store.mouseEffect.Y}px` }}
			/>
		</header>
	);
};
