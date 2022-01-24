import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";

export const Booking_resume = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="modal-window">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">{store.booking.service.name}</h5>
					</div>
					<div className="modal-body">
						<p>{store.booking.date}</p>
						<p>{store.booking.time}</p>
					</div>
					<div className="modal-footer">
						<button
							onClick={() => actions.setPopup("calendar", "¿Cuándo?")}
							type="button"
							className="btn btn-secondary">
							Volver
						</button>
						<button
							onClick={() => actions.book(store.booking.service.sku)}
							type="button"
							className="btn btn-success"
							id="checkout-button-sku_KvCUm3AeHMjmrk"
							role="link">
							Pagar
						</button>
					</div>
					<div id="error-message" />
				</div>
			</div>
		</div>
	);
};
