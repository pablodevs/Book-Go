import React, { useState } from "react";
import { Calendar } from "../calendar/calendar";

export const Booking = () => {
	let [calendar, setCalendar] = useState(false);

	const renderCalendar = () => {
		setCalendar(true);
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
