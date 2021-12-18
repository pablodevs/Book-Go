import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

export const ReservationsHistory = () => {
	const { actions, store } = useContext(Context);

	useEffect(() => {}, []);

	return (
		<div className="dashboard-reservations-wrapper">
			<h1 className="dashboard-content-title">Reservas</h1>
			Aquí aparecerán las reservas más adelante
		</div>
	);
};
