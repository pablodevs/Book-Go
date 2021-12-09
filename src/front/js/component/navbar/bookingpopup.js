import React, { useContext } from "react";
import { Context } from "../../store/appContext.js";
import { Calendar } from "../calendar/calendar";
import "../../../styles/components/bookingpopup.scss";

export const BookingPopup = () => {
	const { store, actions } = useContext(Context);
	return (
		<div className="popup booking">
			<div className="popup-header">
				<h1 className="popup-heading">¿Cuando?</h1>
				<button onClick={() => actions.setBool("navbarBooking", "close")}>
					<i className="fas fa-times" />
				</button>
			</div>
			<Calendar />
		</div>
	);
};
