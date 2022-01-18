import React, { useContext } from "react";
import { Context } from "../../store/appContext";

export const ServicesPopup = () => {
	const { actions, store } = useContext(Context);
	// console.log(store.services);

	return (
		<div className="container popup-container popup-body">
			Nuestros servicios:
			<div className="row popup-row">
				{store.services.map((item, index) => (
					<div className="col-auto" key={index}>
						<button
							className="service-btn"
							onClick={() => actions.setPopup("calendar", "¿Cuándo?", item.name)}>
							{item.name}
						</button>
					</div>
				))}
			</div>
		</div>
	);
};
