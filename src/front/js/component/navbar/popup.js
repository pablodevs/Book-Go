import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext.js";
import { Login } from "../login/login.js";
import { Signup } from "../login/signup.js";
import { Booking } from "../navbar/booking.js";
import "../../../styles/components/popup.scss";

export const Popup = () => {
	const { store, actions } = useContext(Context);

	useEffect(() => {
		const handleKeyDown = event => {
			if (event.key === "Escape") actions.closePopup();
			if (store.popup === null) document.removeEventListener("keydown", handleKeyDown);
		};
		document.addEventListener("keydown", handleKeyDown);

		document.addEventListener("click", function handleDocClick(e) {
			if (e.target === document.querySelector(".popup-grey")) {
				actions.closePopup();
				document.removeEventListener("click", handleDocClick);
			}
		});
	}, []);

	return (
		<div className="popup-grey">
			<div className="popup">
				<button className="popup-close" onClick={() => actions.closePopup()}>
					<i className="fas fa-times" />
				</button>
				<h1 className="popup-header">{store.popupTitle}</h1>
				{store.popup === "login" ? (
					<Login />
				) : store.popup === "signup" ? (
					<Signup />
				) : store.popup === "booking" ? (
					<Booking />
				) : (
					<h1>ERROR</h1>
				)}
			</div>
		</div>
	);
};
