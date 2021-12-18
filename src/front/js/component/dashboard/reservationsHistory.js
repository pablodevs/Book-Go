import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { BookingCard } from "./bookingcard";

export const ReservationsHistory = () => {
	const { actions, store } = useContext(Context);

	useEffect(() => {}, []);

	return (
		<div className="dashboard-reservations-wrapper">
			<h1 className="dashboard-content-title">Reservas</h1>
			<h3>Próximas reservas</h3>
			<BookingCard />
			<h3>Reservas pasadas</h3>
			<BookingCard />
		</div>
	);
};
