import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
// User
import { Login } from "./login/login.js";
import { Signup } from "./login/signup.js";
import { Guest } from "./login/guest.js";
// Booking
import { ServicesPopup } from "./booking/servicesPopup.js";
import { Calendar } from "./booking/calendar/calendar.js";
import { Booking_resume } from "./booking/booking_resume.jsx";
// Admin Services
import { EditInput } from "./admin/popups/editInput.js";
import { AddService } from "./admin/popups/addService.js";
import { AddService2 } from "./admin/popups/addService2.js";
import { AddImg } from "./admin/popups/addImg.js";
// General Popups
import { ConfirmPopup } from "./popups/confirmPopup.js";
import { EditImg } from "./popups/editImg.js";

import "../../styles/components/popup.scss";

export const Popup = () => {
	const { store, actions } = useContext(Context);

	const handleKeyDown = event => {
		if (event.key === "Escape") {
			actions.closePopup(true);
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("mousedown", handleMouseDown);
		}
	};
	const handleMouseDown = e => {
		if (e.target === document.querySelector(".popup-bg")) document.addEventListener("mouseup", handleMouseUp);
	};
	const handleMouseUp = e => {
		if (e.target === document.querySelector(".popup-bg")) {
			actions.closePopup(true);
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
							actions.closePopup(true);
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
				) : store.popup === "edit-service-name" ? (
					<EditInput input={store.popupTitle.split(" ")[store.popupTitle.split(" ").length - 1]} />
				) : store.popup === "edit-img" ? (
					<EditImg />
				) : store.popup === "add-img" ? (
					<AddImg />
				) : store.popup === "add-service" ? (
					<AddService />
				) : store.popup === "add-service2" ? (
					<AddService2 />
				) : store.popup === "confirm" ? (
					<ConfirmPopup />
				) : null}
			</div>
		</div>
	);
};
