import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext.js";
import { Login } from "../login/login.js";
import { Signup } from "../login/signup.js";
import { Booking } from "../navbar/booking.js";
import PropTypes from "prop-types";
import "../../../styles/components/popup.scss";

export const Popup = props => {
	const { store, actions } = useContext(Context);

	return (
		<div className="popup">
			<button className="popup-close" onClick={() => actions.closePopup()}>
				<i className="fas fa-times" />
			</button>
			<h1 className="popup-header">{props.title}</h1>
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
	);
};

Popup.propTypes = {
	type: PropTypes.string,
	title: PropTypes.string
};
