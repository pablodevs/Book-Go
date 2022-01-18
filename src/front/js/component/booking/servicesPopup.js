import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";

export const ServicesPopup = () => {
	const { actions, store } = useContext(Context);

	useEffect(() => actions.updateBooking("date", ""), []);

	return (
		<div className="container popup-container popup-body">
			Nuestros servicios:
			<div className="row popup-row">
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
