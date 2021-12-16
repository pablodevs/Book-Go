import React, { useContext } from "react";
import { Context } from "../../store/appContext";
import "../../../styles/components/productsPopup.scss";

export const ProductsPopup = () => {
	const { actions, store } = useContext(Context);
	console.log(store.products);

	return (
		<div>
			<p className="text-danger fs-4 py-3">Aquí aparecerán todos los productos</p>
			<div className="container">
				<div className="row">
					{store.products.map((item, index) => (
						<div className="col text-center" key={index}>
							<button
								className="btn btn-info mb-4"
								onClick={() => actions.setPopup("calendar", "¿Cuándo?")}>
								{item.name}
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
