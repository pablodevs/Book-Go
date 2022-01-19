import React, { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";

export const Pago = () => {
	const { store, actions } = useContext(Context);
	const params = useParams();

	useEffect(
		() => {
			if (store.booking.data) {
				fetch(process.env.BACKEND_URL + `/book/${params.user_id}`, {
					method: "POST",
					headers: {
						Authorization: "Bearer " + localStorage.getItem("token"),
						"Content-type": "application/json"
					},
					body: JSON.stringify({
						date: store.booking.date,
						time: store.booking.time,
						service: store.booking.service.name
					})
				})
					.then(res => res.json())
					.then(
						response => (
							console.log("Success:", JSON.stringify(response.message)),
							actions.setToast("success", response.message)
						)
					)
					.catch(error => console.error("Error:", error));
			}
		},
		[store.booking]
	);

	return <Redirect to="/dashboard/bookings" />;
};
