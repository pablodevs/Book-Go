import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { BookingCard } from "./bookingcard";

export const ReservationsHistory = () => {
	const { actions, store } = useContext(Context);

	useEffect(() => {}, []);

	return (
		<div className="dashboard-content-wrapper">
			<h1 className="dashboard-content-title">Reservas</h1>
			<h2 className="dashboard-content-subtitle">Próximas reservas</h2>
			<BookingCard />
			<h2 className="dashboard-content-subtitle">Reservas pasadas</h2>
			<BookingCard />
		</div>
	);
};
