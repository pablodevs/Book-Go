import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

export const BookingCard = () => {
	const { actions, store } = useContext(Context);
	let product = "Spa";

	useEffect(() => {}, []);

	return (
		<div className="bookingcard-wrapper">
			<div className="bookingcard-content">
				<h1 className="bookingcard-title">{product}</h1>
				<div>
					Fecha:{" "}
					<span className="bookingcard-date">
						{new Date(2022, 0, 3, 9, 5).toLocaleDateString()}{" "}
						{new Date(2022, 0, 3, 9, 5).toLocaleTimeString().slice(0, -3)}
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
					className="book-again-btn"
					onClick={() => actions.setPopup("calendar", "Selecciona un nuevo día", product)}>
					Reservar de nuevo
				</button>
			</div>
			<div className="bookingcard-img-wrapper">
				<img
					src={require(`../../../img/${product.toLowerCase()}.jpg`)}
					className="bookingcard-img"
					alt="imagen del producto"
				/>
			</div>
		</div>
	);
};
