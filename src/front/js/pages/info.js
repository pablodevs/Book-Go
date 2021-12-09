import React, { useContext } from "react";
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
						<span className="btn btn-success border-warning shadow btn-lg" href="#" role="button">
							Reservar
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
