import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

export const Info = () => {
	const { actions, store } = useContext(Context);

	return (
		<div className="container-sm border border-rounded m-5 mx-auto bg-light">
			<div className="jumbotron m-3 ">
				<h1 className="display-4">{store.oneProduct.name}!</h1>
				<p className="lead">{store.oneProduct.description}</p>
				<hr className="my-4" />
				<div className="row">
					<div className="col">
						<h4>Precio: {store.oneProduct.price} €/hora</h4>
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
								actions.setPopup("calendar", "Selecciona el día", store.oneProduct.name);
							}}>
							Reservar
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
