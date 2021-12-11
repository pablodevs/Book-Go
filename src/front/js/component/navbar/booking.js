import React, { useState, useContext } from "react";
import { Context } from "../../store/appContext";
import { Calendar } from "../calendar/calendar";

export const Booking = () => {
	const { actions, store } = useContext(Context);
	let [calendar, setCalendar] = useState(false);

	const renderCalendar = () => {
		setCalendar(true);
		actions.setPopupTitle("¿Cuándo?");
	};

	return (
		<>
			{calendar ? (
				""
			) : (
				<div>
					<h3 className="text-danger py-3">Aquí aparecerán todos los productos</h3>
					<button className="btn btn-info mb-4" onClick={renderCalendar}>
						Producto x
					</button>
				</div>
			)}
			{calendar ? <Calendar /> : null}
		</>
	);
};
