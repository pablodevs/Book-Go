import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

export const BookingCard = () => {
	const { actions, store } = useContext(Context);
	let service = "Depilación";

	useEffect(() => {}, []);

	return (
		<div className="bookingcard-wrapper">
			<div className="bookingcard-content">
				<h1 className="bookingcard-title">{service}</h1>
				<div>
					Fecha:{" "}
					<span className="bookingcard-date">
						{new Date(2022, 0, 3, 9, 5).toLocaleDateString(undefined, {
							year: "numeric",
							month: "2-digit",
							day: "2-digit"
						})}{" "}
						{new Date(2022, 0, 3, 9, 5).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
					</span>
				</div>
				<div>
					Estado:{" "}
					<span className="bookingcard-confirmed">
						Confirmada <i className="far fa-check-circle" />
					</span>
					{/* <span className="bookingcard-canceled">
						Cancelada <i className="fas fa-ban" />
					</span> */}
				</div>
				<button
					className="btn-cool book-again-btn"
					onClick={() => actions.setPopup("calendar", "Selecciona un nuevo día", service)}>
					Reservar de nuevo
				</button>
			</div>
			<div className="bookingcard-img-wrapper">
				<img
					src={require(`../../../img/${service.toLowerCase()}.jpg`)}
					className="bookingcard-img"
					alt="imagen del servicio"
				/>
			</div>
		</div>
	);
};
