import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import "../../../styles/components/bookingResume.scss";
import dates from "../../dates.json";

export const Booking_resume = () => {
	const { store, actions } = useContext(Context);

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
		let timeInMins = parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
		let endTime = timeInMins + duration;
		let endTimeHours = parseInt(endTime / 60);
		let endTimeMins = endTime % 60;

		return `${time} — ${resetTimeFormat(endTimeHours, endTimeMins)}`;
	};

	const getPrettyDate = () => {
		let [day, month, year, hour, minute] = [
			...store.booking.date.split("/").map(element => parseInt(element)),
			...store.booking.time.split(":").map(element => parseInt(element))
		];
		let date = new Date(year, month - 1, day, hour, minute);
		let weekday = dates.pretty_weekday[date.getDay()];
		let time = prettyTime(store.booking.time, store.booking.service.duration);
		month = dates.month_text[date.getMonth()];
		month = month.charAt(0).toUpperCase() + month.slice(1);

		return (
			<div className="booking-resume-date">
				{weekday},{" "}
				<span>
					{day} de {month}
				</span>{" "}
				de {year}, <span>{time}</span>
			</div>
		);
	};

	return (
		<div className="popup-body" style={{ gap: "0" }}>
			<div className="booking-resume">
				<div className="booking-resume-body">
					<h2 className="booking-resume-subtitle">CUANDO</h2>
					<div className="booking-resume-row">
						{getPrettyDate()}
						<small>{store.business.address}</small>
					</div>
					<h2 className="booking-resume-subtitle">SERVICIO</h2>
					<div className="booking-resume-row">
						<div className="d-flex flex-row justify-between-around w-100">
							<span className="me-auto">{store.booking.service.name}</span>
							<span className="booking-resume-price">{store.booking.service.price} €</span>
						</div>
					</div>
				</div>
				<div className="d-flex flex-row justify-content-between justify-content-md-around w-100 mt-auto">
					<button onClick={() => actions.goToPrevPopup()} type="button" className="btn-skip">
						Volver
					</button>
					<button
						onClick={() => actions.book(store.booking.service.sku)}
						type="button"
						className="btn-cool m-0 btn-payment"
						id="checkout-button-sku_KvCUm3AeHMjmrk">
						{/* role="link" */}
						Pagar
					</button>
				</div>
			</div>
			<div id="error-message" />
		</div>
	);
};
