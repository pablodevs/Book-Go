import React, { useContext } from "react";
import { Context } from "../../store/appContext";
import "../../../styles/components/productsPopup.scss";

export const ProductsPopup = () => {
	const { actions, store } = useContext(Context);
	// console.log(store.products);

	return (
		<div className="container popup-container popup-body">
			Nuestros servicios:
			<div className="row popup-row">
				{store.products.map((item, index) => (
					<div className="col-auto" key={index}>
						<button
							className="product-btn"
							onClick={() => actions.setPopup("calendar", "¿Cuándo?", item.name)}>
							{item.name}
						</button>
					</div>
				))}
			</div>
		</div>
	);
};
