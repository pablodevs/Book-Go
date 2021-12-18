import React, { useContext } from "react";
import { Context } from "../../store/appContext";
import "../../../styles/components/productsPopup.scss";

export const ProductsPopup = () => {
	const { actions, store } = useContext(Context);
	console.log(store.products);

	return (
		<div>
			<div className="container">
				<div className="row">
					{store.products.map((item, index) => (
						<div className="col text-center" key={index}>
							<button
								className="btn btn-info mb-4"
								onClick={() => actions.setPopup("calendar", "¿Cuándo?", item.name)}>
								{item.name}
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
