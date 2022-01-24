import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import "./../../styles/pages/info.scss";

export const Info = () => {
	const { actions, store } = useContext(Context);
	const params = useParams();

	return store.services.map((service, idx) => {
		if (service.id === parseInt(params.id)) {
			return (
				<div id="info" key={idx}>
					<div className="container-sm border border-rounded m-5 mr-0 bg-light w-25 box">
						<div className="card m-3 p-3 border-white">
							<h1 className="display-4 head_title">{service.name}</h1>
							<p className="lead">{service.description}</p>
							<hr className="my-4" />
							<div className="row">
								<div className="col">
									<h4>Precio: </h4>
									<h5>{service.price} €/hora</h5>
								</div>

								<div className="col text-end">
									<button className="btn  shadow  m-2">
										<Link to="/" className=" m-2">
											Volver
										</Link>
									</button>
									<span
										className="btn shadow text-white bg-success btn-lg p-2"
										href="#"
										role="button"
										onClick={() => {
											actions.setPopup("calendar", "Selecciona el día", service.name);
										}}>
										Reservar
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}
	});
};
