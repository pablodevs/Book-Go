import React, { useContext } from "react";
import { Context } from "../../store/appContext";

export const ProductsPopup = () => {
	const { actions, store } = useContext(Context);

	return (
		<div>
			<p className="text-danger fs-4 py-3">Aquí aparecerán todos los productos</p>
			<button className="btn btn-info mb-4" onClick={() => actions.setPopup("calendar", "¿Cuándo?")}>
				Producto x
			</button>
		</div>
	);
};
