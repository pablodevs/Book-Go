import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";

export const ServicesPopup = () => {
	const { actions, store } = useContext(Context);

	useEffect(() => actions.updateBooking("date", ""), []);

	return (
		<div className="container-fluid px-4 pb-4">
			<h2 className="popup-subtitle mb-3">Nuestros servicios:</h2>
			<div className="row" style={{ gap: "1rem" }}>
				{store.services.map((item, index) => (
					<div className="col-auto" key={index}>
						<button
							className="service-btn"
							onClick={() => {
								actions.updateBooking("service", item);
								actions.calendarActions.renderHoursDispo();
								actions.setPopup("calendar", `${item.name}: ¿Cuándo?`);
							}}>
							{item.name}
						</button>
					</div>
				))}
			</div>
		</div>
	);
};
