import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import "./../../styles/pages/info.scss";

export const Info = () => {
	const { actions, store } = useContext(Context);
	const params = useParams();

	useEffect(() => {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	}, []);

	return store.services.map((service, idx) => {
		if (service.id === parseInt(params.id)) {
			return (
				<div id="info" key={idx}>
					<div className="info-box center mt-auto">
						<div className="card info-card">
							<h1 className="display-4 head_title mb-3">{service.name}</h1>
							<p className="lead of-y">{service.description}</p>
							<hr className="my-4" />
							<div className="row">
								<div className="col">
									<h4>Precio: </h4>
									<h5>{service.price} €/hora</h5>
								</div>
								<div className="col-auto text-end">
									<button
										className="btn-cool btn-pink"
										onClick={() => {
											actions.updateBooking("service", service);
											actions.setPopup("calendar", `${service.name}: ¿Cuándo?`, service.name);
										}}>
										Reservar
									</button>
									<Link to="/" className="btn-skip btn-skip-info">
										<span>Volver</span>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}
	});
};
