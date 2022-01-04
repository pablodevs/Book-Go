import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";

export const Info = () => {
	const { actions, store } = useContext(Context);
	const params = useParams();

	return store.products.map(prod => {
		if (prod.id == params.id) {
			return (
				<div className="container-sm border border-rounded m-5 mx-auto bg-light">
					<div className="jumbotron m-3">
						<h1 className="display-4">{prod.name}!</h1>
						<p className="lead">{prod.description}</p>
						<hr className="my-4" />
						<div className="row">
							<div className="col">
								<h4>Precio: {prod.price} €/hora</h4>
							</div>

							<div className="col text-end">
								<button className="btn btn-secondary border-warning shadow btn-lg m-2">
									<Link to="/" className="text-white m-2">
										Volver
									</Link>
								</button>
								<span
									className="btn btn-success border-warning shadow btn-lg text-white"
									href="#"
									role="button"
									onClick={() => {
										actions.setPopup("calendar", "Selecciona el día", prod.name);
									}}>
									Reservar
								</span>
							</div>
						</div>
					</div>
				</div>
			);
		}
	});
};
