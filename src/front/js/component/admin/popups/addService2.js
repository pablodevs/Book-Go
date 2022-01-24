import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../store/appContext";

export const AddService2 = () => {
	const { actions, store } = useContext(Context);

	const [schedule, setSchedule] = useState(false);
	const [data, setData] = useState({
		sku: store.serviceInProgress.sku || "",
		is_active: store.serviceInProgress.is_active || false
	});

	useEffect(
		() => {
			// Comprobamos si existe un horario
			if (
				store.business.schedule &&
				store.business.weekdays &&
				store.business.schedule !== "00:00,00:00" &&
				store.business.schedule.split(",")[0] !== store.business.schedule.split(",")[1] &&
				store.business.weekdays[0] !== "" &&
				data.sku
			)
				setSchedule(true);
		},
		[data, store.business]
	);

	const handleInputChange = e => setData({ ...data, [e.target.name]: e.target.value });

	const handleSubmit = event => {
		event.preventDefault();
		actions.updateServiceInProgress(data);
		actions.setPopup("add-img", "Añadir una foto al servicio");
	};

	return (
		<div className="popup-body">
			<form onSubmit={handleSubmit} className="dashboard-form popup-form">
				<p>
					Es necesario agregar un <strong>Código de artículo</strong> asociado al servicio que permitirá a tus
					clientes realizar los pagos online.
				</p>
				<div className="admin-form-group">
					<div className="admin-form-subgroup">
						<label className="dashboard-label" htmlFor="new-sku">
							Sku (código de artículo)
						</label>
						<div className="dashboard-input">
							<input
								id="new-sku"
								type="text"
								name="sku"
								maxLength="150"
								required
								value={data.sku}
								autoComplete="off"
								onChange={handleInputChange}
							/>
							<button
								type="button"
								className="clear-input"
								onClick={() => {
									setData({
										...data,
										sku: ""
									});
								}}>
								<i className="fas fa-times" />
							</button>
						</div>
					</div>
				</div>
				<p>Al Activar el servicio, este aparecerá automáticamente en la página de inicio.</p>
				<div className="admin-form-group">
					<div className="admin-form-subgroup">
						<div className="form-check form-switch">
							<label
								className="form-check-label"
								htmlFor="new_is_active"
								data-tooltip={
									schedule
										? "Permite que se pueda reservar este servicio"
										: "Primero define un horario y un sku"
								}>
								<input
									className="form-check-input"
									type="checkbox"
									role="switch"
									id="new_is_active"
									disabled={!schedule}
									checked={data.is_active}
									onChange={() =>
										setData({
											...data,
											is_active: !data.is_active
										})
									}
								/>
								Activar servicio
							</label>
						</div>
					</div>
				</div>
				<div className="d-flex flex-row">
					<button type="submit" className="btn-cool">
						Continuar
					</button>
					<button
						type="button"
						className="btn-skip"
						onClick={() => actions.setPopup("add-img", "Añadir una foto al servicio")}>
						Omitir
						<i className="fas fa-arrow-right" />
					</button>
				</div>
			</form>
		</div>
	);
};
