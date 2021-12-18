import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

export const BookingCard = () => {
	const { actions, store } = useContext(Context);

	useEffect(() => {}, []);

	return <div className="bookingcard-wrapper">Ejemplo de reserva</div>;
};
