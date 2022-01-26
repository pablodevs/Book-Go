import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import PropTypes from "prop-types";

export const BookingLi = props => {
	const { actions, store } = useContext(Context);

	const pretyTime = (time, duration) => {
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
			<li className="fw-bold">
				{props.date.toLocaleDateString(undefined, {
					year: "numeric",
					month: "2-digit",
					day: "2-digit"
				})}
				<br />
				{pretyTime(
					props.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
					props.service.duration
				)}
			</li>
			<li>
				Servicio
				<br />
				<span className="fw-bold">{props.service.name}</span>
			</li>
			<li>
				Estado
				<br />
				{props.status === "Confirmed" ? (
					<span className="bookingcard-confirmed">
						Confirmada <i className="far fa-check-circle" />
					</span>
				) : (
					<span className="bookingcard-canceled">
						Cancelada <i className="fas fa-ban" />
					</span>
				)}
			</li>
			<li className="fw-bold bookingLi-price">{props.service.price} €</li>
			<li className="bookingLi-cancel">
				{props.status === "Confirmed" ? (
					<button
						className="logout btn-cool"
						onClick={() => {
							const deleteFunct = () => actions.cancelBooking(props.bookID);
							actions.setPopup(
								"confirm",
								"Cancelar cita",
								{
									button: "Cancelar",
									toast: {
										success: "Cita cancelada",
										loading: "Cancelando..."
									},
									message: "Esta acción no podrá deshacerse."
								},
								deleteFunct
							);
						}}>
						<i className="fas fa-trash-alt m-0" />
					</button>
				) : (
					// <button
					// 	className="btn-cool btn-confirm"
					// 	onClick={() => {
					// 		const deleteFunct = () => actions.cancelBooking(props.bookID);
					// 		actions.setPopup(
					// 			"confirm",
					// 			"Cancelar cita",
					// 			{
					// 				button: "Cancelar",
					// 				toast: {
					// 					success: "Cita cancelada",
					// 					loading: "Cancelando..."
					// 				},
					// 				message: "Esta acción no podrá deshacerse."
					// 			},
					// 			deleteFunct
					// 		);
					// 	}}>
					// 	<i className="fas fa-trash-alt m-0" />
					// </button>
					""
				)}
			</li>
		</ul>
	);
};

BookingLi.propTypes = {
	date: PropTypes.object,
	service: PropTypes.object,
	status: PropTypes.string,
	bookID: PropTypes.number
};
