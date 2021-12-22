import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Context } from "../../store/appContext";

export const EditInput = props => {
	const { actions, store } = useContext(Context);
	const [data, setData] = useState({ id: null, name: "" });

	useEffect(() => {
		let prod_id = store.products.find(element => element.name === props.input).id;
		setData({ id: prod_id, name: props.input });
	}, []);

	const handleSubmit = event => {
		event.preventDefault();
		if (data.name !== "") {
			actions.updateProduct(data);
			actions.closePopup();
		}
	};

	return (
		<div className="popup-body">
			<form className="dashboard-form" onSubmit={handleSubmit}>
				<div className="admin-form-subgroup">
					<label className="dashboard-label" htmlFor="product-edit">
						Nuevo nombre:
					</label>
					<input
						id="product-edit"
						type="text"
						value={data.name}
						onChange={e => setData({ ...data, name: e.target.value })}
					/>
				</div>
				<button type="submit" className="btn-cool btn-confirm">
					Confirmar cambios
				</button>
			</form>
		</div>
	);
};

EditInput.propTypes = {
	input: PropTypes.string
};
