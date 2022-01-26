import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Context } from "../../store/appContext";
import dates from "../../dates.json";

export const BookingLi = props => {
	const { actions, store } = useContext(Context);

	const prettyDate = date => [dates.pretty_month[date.getMonth()], date.getDate()];
	const prettyTime = (time, duration) => {
		const resetTimeFormat = (hours, minutes) => {
			hours = hours.toString();
			minutes = minutes.toString();
			let outputList = [];
			for (let i of [hours, minutes]) {
				if (i.length === 1) outputList.push("0" + i);
				else outputList.push(i);
			}

			return `${outputList[0]}:${outputList[1]}`;
		};

		let timeInMins = parseInt(time.split(":")[0]) * 60;
		let endTime = timeInMins + duration;
		let endTimeHours = parseInt(endTime / 60);
		let endTimeMins = endTime % 60;

		return `${time} — ${resetTimeFormat(endTimeHours, endTimeMins)}`;
	};

	return (
		<ul className="bookingLi">
			<li
				className="bookingLi-date"
				data-status={props.date.getTime() < new Date().getTime() ? "Disabled" : props.status}>
				{prettyDate(props.date)[0]}
				<br />
				<span className="bookingLi-day">{prettyDate(props.date)[1]}</span>
				<br />
				{prettyTime(
					props.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
					props.service.duration
				)}
			</li>
			<li>
				Servicio
				<br />
				<span className="fw-bold">{props.service.name}</span>
			</li>
			{props.date.getTime() < new Date().getTime() ? (
				""
			) : props.status === "Confirmed" ? (
				<li>
					Estado
					<br />
					<span className="bookingcard-confirmed">
						Confirmada <i className="far fa-check-circle" />
					</span>
				</li>
			) : (
				<li>
					Estado
					<br />
					<span className="bookingLi-canceled">
						Cancelada <i className="fas fa-ban" />
					</span>
				</li>
			)}
			<li className="fw-bold bookingLi-price">{props.service.price} €</li>
			{props.date.getTime() > new Date().getTime() ? (
				<li className="bookingLi-cancel">
					{props.status === "Confirmed" ? (
						<button
							className="bookingLi-btn-cancel center"
							data-tooltip="Cancelar cita"
							onClick={() => {
								const deleteFunct = () =>
									actions.editBooking(props.bookID, { status: "Canceled" }, props.client.id);
								actions.setPopup(
									"confirm",
									"Cancelar cita",
									{
										button: "Cancelar",
										toast: {
											success: "Cita cancelada",
											loading: "Cancelando..."
										},
										message: "Pulsa para cancelar la cita"
									},
									deleteFunct
								);
							}}>
							<i className="fas fa-trash-alt m-0" />
						</button>
					) : (
						<button
							className="bookingLi-btn-confirm center"
							data-tooltip="Confirmar cita"
							onClick={() => {
								const confirmFunct = () =>
									actions.editBooking(props.bookID, { status: "Confirmed" }, props.client.id);
								actions.setPopup(
									"confirm",
									"Confirmar cita",
									{
										button: "Confirmar",
										toast: {
											success: "Cita confirmada",
											loading: "Procesando..."
										},
										message: "Pulsa para confirmar la cita",
										style: "success"
									},
									confirmFunct
								);
							}}>
							<i className="fas fa-check" />
						</button>
					)}
				</li>
			) : (
				""
			)}
		</ul>
	);
};

BookingLi.propTypes = {
	date: PropTypes.object,
	service: PropTypes.object,
	client: PropTypes.object,
	status: PropTypes.string,
	bookID: PropTypes.number
};
