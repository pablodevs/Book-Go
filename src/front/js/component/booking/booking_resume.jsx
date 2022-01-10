import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
// Load Stripe.js on your website.

export const Booking_resume = () => {
	const { store, actions } = useContext(Context);

	var stripe = Stripe("pk_test_yHT02IrsuQ0eWhAT2BBbfxmR");

	const reservar = () => {
		stripe
			.redirectToCheckout({
				lineItems: [{ price: "sku_KvCUm3AeHMjmrk", quantity: 1 }],
				mode: "payment",
				/*
	 * Do not rely on the redirect to the successUrl for fulfilling
	 * purchases, customers may not always reach the success_url after
	 * a successful payment.
	 * Instead use one of the strategies described in
	 * https://stripe.com/docs/payments/checkout/fulfill-orders
	 */
				successUrl: "https://3000-gold-felidae-8otxygdm.ws-eu25.gitpod.io/dashboard",
				cancelUrl: "https://jmanvel.com/canceled"
			})
			.then(function(result) {
				if (result.error) {
					/*
	   * If `redirectToCheckout` fails due to a browser or network
	   * error, display the localized error message to your customer.
	   */
					var displayError = document.getElementById("error-message");
					displayError.textContent = result.error.message;
				}
			});
	};

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
						<button
							onClick={() => {
								reservar();
							}}
							type="button"
							className="btn btn-success"
							id="checkout-button-sku_KvCUm3AeHMjmrk"
							role="link">
							RESERVAR
						</button>
					</div>
					<div id="error-message" />
				</div>
			</div>
		</div>
	);
};
