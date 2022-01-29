import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../store/appContext";

export const EditInput = () => {
	const { actions, store } = useContext(Context);
	const [data, setData] = useState({ id: store.popupObj.id, name: store.popupObj.service });

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
				"toast-success"
			);
			actions.closePopup();
		}
	};

	return (
		<div className="popup-body">
			<form className="dashboard-form" onSubmit={handleSubmit}>
				<div className="admin-form-subgroup input-wrapper">
					<input
						id="popup-service-edit"
						type="text"
						maxLength="120"
						value={data.name}
						onChange={e => setData({ ...data, name: e.target.value })}
					/>
					<label className="dashboard-label" htmlFor="popup-service-edit">
						Nuevo nombre:
					</label>
				</div>
				<button type="submit" className="btn-cool btn-confirm">
					Confirmar cambios
				</button>
			</form>
		</div>
	);
};
