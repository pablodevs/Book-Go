import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Context } from "../../../store/appContext";

export const EditInput = props => {
	const { actions, store } = useContext(Context);
	const [data, setData] = useState({ id: null, name: "" });

	useEffect(() => {
		let prod_id = store.services.find(element => element.name === props.input).id;
		setData({ id: prod_id, name: props.input });
	}, []);

	const handleSubmit = event => {
		event.preventDefault();
		if (data.name !== "") {
			actions.setToast(
				"promise",
				{
					loading: "Guardando...",
					success: resp => `Nuevo nombre: ${resp.name}`
				},
				actions.updateService(data),
				"toast-confirm"
			);
			actions.closePopup();
		}
	};

	return (
		<div className="popup-body">
			<form className="dashboard-form" onSubmit={handleSubmit}>
				<div className="admin-form-subgroup">
					<label className="dashboard-label" htmlFor="popup-service-edit">
						Nuevo nombre:
						<span>{data.name.length}</span>
					</label>
					<input
						id="popup-service-edit"
						type="text"
						maxLength="120"
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
