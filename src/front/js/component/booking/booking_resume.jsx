import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";

export const Booking_resume = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="modal-window">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">
							{store.products.map(item => {
								if (item.id == store.booking.product_id) return item.name;
							})}
						</h5>
					</div>
					<div className="modal-body">
						<p>{store.booking.date}</p>
						<p>{store.booking.time}</p>
					</div>
					<div className="modal-footer">
						<button onClick={() => actions.goToPrevPopup()} type="button" className="btn btn-secondary">
							Cerrar
						</button>
						<button type="button" className="btn btn-success">
							RESERVAR
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
