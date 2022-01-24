import React, { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";

export const Pago = () => {
	const { store, actions } = useContext(Context);
	const params = useParams();

	useEffect(() => {
		const booking = JSON.parse(localStorage.getItem("store")).booking;
		fetch(process.env.BACKEND_URL + `/book/${params.user_id}`, {
			method: "POST",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
				"Content-type": "application/json"
			},
			body: JSON.stringify({
				date: booking.date,
				time: booking.time,
				service_id: booking.service.id
			})
		})
			.then(response => response.json())
			.then(
				resp => (
					console.log("Success:", JSON.stringify(resp.message)), actions.setToast("success", resp.message)
				)
			)
			.catch(error => console.error("Error:", error));
	}, []);

	return <Redirect to="/dashboard/bookings" />;
};
