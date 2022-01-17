import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import { Login } from "./login/login.js";
import { Signup } from "./login/signup.js";
import { Guest } from "./login/guest.js";
import { ServicesPopup } from "./booking/servicesPopup.js";
import { Calendar } from "./booking/calendar/calendar.js";
import { EditInput } from "./admin/popups/editInput.js";
import { AddService } from "./admin/popups/addService.js";
import { ConfirmPopup } from "./confirmPopup.js";
import "../../styles/components/popup.scss";
import { Booking_resume } from "./booking/booking_resume.jsx";

export const Popup = () => {
	const { store, actions } = useContext(Context);

	const handleKeyDown = event => {
		if (event.key === "Escape") {
			actions.closePopup();
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("mousedown", handleMouseDown);
		}
	};
	const handleMouseDown = e => {
		if (e.target === document.querySelector(".popup-bg")) document.addEventListener("mouseup", handleMouseUp);
	};
	const handleMouseUp = e => {
		if (e.target === document.querySelector(".popup-bg")) {
			actions.closePopup();
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("keydown", handleKeyDown);
		} else document.removeEventListener("mouseup", handleMouseUp);
	};

	useEffect(
		() => {
			if (store.popup !== null) {
				document.addEventListener("mousedown", handleMouseDown);
				document.addEventListener("keydown", handleKeyDown);
			}
		},
		[store.popup]
	);

	return (
		<div
			onMouseDown={() => undefined}
			onMouseUp={() => undefined}
			className={"popup-bg" + (store.popup ? " popup-bg-show" : "")}>
			<div className={"popup" + (store.popup ? " popup-show" : "")}>
				<div className="popup-header">
					<button className="popup-return" onClick={() => actions.goToPrevPopup()}>
						<i className="fas fa-arrow-left" />
					</button>
					<h1>{store.popupTitle}</h1>
					<button
						className="popup-close"
						onClick={() => {
							document.removeEventListener("keydown", handleKeyDown);
							document.removeEventListener("mousedown", handleMouseDown);
							actions.closePopup();
						}}>
						<i className="fas fa-times" />
					</button>
				</div>
				{store.popup === "login" ? (
					<Login />
				) : store.popup === "signup" ? (
					<Signup />
				) : store.popup === "booking" ? (
					<ServicesPopup />
				) : store.popup === "calendar" ? (
					<Calendar />
				) : store.popup === "resume" ? (
					<Booking_resume />
				) : store.popup === "guest" ? (
					<Guest />
				) : store.popup === "edit-service" ? (
					<EditInput input={store.popupTitle.split(" ")[store.popupTitle.split(" ").length - 1]} />
				) : store.popup === "add-service" ? (
					<AddService />
				) : store.popup === "confirm" ? (
					<ConfirmPopup />
				) : null}
			</div>
		</div>
	);
};
