// ⚠️ SUBIR A CARPETA ./component ⚠️

import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext.js";
import { Login } from "../login/login.js";
import { Signup } from "../login/signup.js";
import { Booking } from "../navbar/booking.js";
import { Calendar } from "../calendar/calendar.js";
import "../../../styles/components/popup.scss";

export const Popup = () => {
	const { store, actions } = useContext(Context);

	useEffect(
		() => {
			const handleKeyDown = event => {
				if (event.key === "Escape") {
					actions.closePopup();
					document.removeEventListener("keydown", handleKeyDown);
					document.removeEventListener("click", handleDocClick);
				}
			};
			const handleDocClick = event => {
				if (event.target === document.querySelector(".popup-bg")) {
					actions.closePopup();
					document.removeEventListener("keydown", handleKeyDown);
					document.removeEventListener("click", handleDocClick);
				}
			};
			if (store.popup !== null) {
				document.addEventListener("keydown", handleKeyDown);
				document.addEventListener("click", handleDocClick);
			}
		},
		[store.popup]
	);

	return (
		<div className={"popup-bg" + (store.popup ? " popup-bg-show" : "")}>
			<div className={"popup" + (store.popup ? " popup-show" : "")}>
				<div className="popup-header">
					<button className="popup-return" onClick={() => actions.goToPrevPopup()}>
						<i className="fas fa-arrow-left" />
					</button>
					<h1>{store.popupTitle}</h1>
					<button className="popup-close" onClick={() => actions.closePopup()}>
						<i className="fas fa-times" />
					</button>
				</div>
				{store.popup === "login" ? (
					<Login />
				) : store.popup === "signup" ? (
					<Signup />
				) : store.popup === "booking" ? (
					<Booking />
				) : store.popup === "calendar" ? (
					<Calendar />
				) : null}
			</div>
		</div>
	);
};
