import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../store/appContext.js";
import { Link } from "react-router-dom";

export const Panel = () => {
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
		<div
			className="service-card card shadow rounded-3 card-background d-block"
			style={{ border: "none", width: "100%", height: "380px", overflow: "hidden" }}>
			<img
				src={"https://www.freevector.com/uploads/vector/preview/25099/Spa2.jpg"}
				className="card-img-top"
				alt="..."
				style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }}
			/>
			<div className="card-body d-flex flex-column text-light" style={{ zIndex: "1", height: "175px" }}>
				<span className="card-title">Descubre nuestros servicios</span>
				<Link
					type="button"
					className="btn btn-info mt-auto"
					to="#"
					onClick={() => {
						actions.setPopup("booking", "¿Qué estás buscando?");
						setNavMenu(false);
						actions.calendarActions.changeHoursView("01/01/2000");
					}}>
					¡Reserva aquí!
				</Link>
			</div>
		</div>
	);
};
