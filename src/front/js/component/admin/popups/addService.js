import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../store/appContext";

export const AddService = () => {
	const { actions, store } = useContext(Context);

	const [minutesList, setMinutesList] = useState([]);
	const [hoursList, setHoursList] = useState([]);
	const [minutes, setMinutes] = useState(0);
	const [hours, setHours] = useState(0);
	const [schedule, setSchedule] = useState(false);
	const [data, setData] = useState({
		name: "",
		price: "",
		description: "",
		duration: "",
		is_active: false,
		sku: ""
		// service_img_url: "",
	});

	useEffect(() => {
		let listOfMinutes = [];
		let listOfHours = [];

		for (let i = 0; i < 60; i += 5) {
			listOfMinutes.push(i);
		}
		for (let i = 0; i <= 24; i += 1) {
			listOfHours.push(i);
		}

		setMinutesList(listOfMinutes);
		setHoursList(listOfHours);

		// Actualizamos la información del negocio
		actions.getBusinessInfo();
	}, []);

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

	useEffect(
		() =>
			setData({
				...data,
				duration: hours * 60 + minutes
			}),
		[hours, minutes]
	);

	const handleInputChange = e => setData({ ...data, [e.target.name]: e.target.value });

	const handleSubmit = event => {
		event.preventDefault();
		if (data.name !== "" && data.price !== "" && data.description !== "") {
			actions.setToast(
				"promise",
				{ loading: "Añadiendo...", success: resp => `Servicio agregado: ${resp.name}` },
				actions.addService(data),
				"toast-success"
			);
		}
	};

	return (
		<div className="popup-body">
			<form onSubmit={handleSubmit} className="dashboard-form">
				<p>Puedes modificar la información del servicio más adelante</p>
				<div className="admin-form-group">
					<div className="admin-form-subgroup">
						<label className="dashboard-label" htmlFor="new-service">
							Nuevo servicio:
							<span>{data.name.length}</span>
						</label>
						<div className="dashboard-input">
							<input
								id="new-service"
								type="text"
								name="name"
								maxLength="120"
								value={data.name}
								autoComplete="off"
								onChange={e => setData({ ...data, name: e.target.value })}
								autoFocus
								required
							/>
							<button
								type="button"
								className="clear-input"
								onClick={() => {
									setData({
										...data,
										name: ""
									});
								}}>
								<i className="fas fa-times" />
							</button>
						</div>
					</div>
				</div>
				<div className="admin-form-group">
					<div className="admin-form-subgroup duration-subgroup">
						<span className="admin-form-subgroup-title">Duración del servicio</span>
						<div className="dflex-row">
							<div>
								<label className="dashboard-label" htmlFor="new-price">
									Precio
								</label>
								<div className="price-input">
									<input
										type="number"
										id="new-price"
										name="price"
										min="0"
										onChange={handleInputChange}
										value={data.price}
										required
									/>
									<span>€</span>
								</div>
							</div>
							<div>
								<label htmlFor="new-hours" className="dashboard-label">
									Hora(s)
								</label>
								<div className="select-wrapper">
									<select
										onChange={e => setHours(parseInt(e.target.value))}
										id="new-hours"
										value={hours}>
										{hoursList.map((hour, idx) => (
											<option key={idx} value={hour}>
												{`${hour}h`}
											</option>
										))}
									</select>
								</div>
								<label htmlFor="new-minutes" className="dashboard-label">
									Minutos
								</label>
								<div className="select-wrapper">
									<select
										onChange={e => setMinutes(parseInt(e.target.value))}
										id="new-minutes"
										value={minutes}>
										{minutesList.map((min, idx) => (
											<option key={idx} value={min}>
												{`${min}min`}
											</option>
										))}
									</select>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="admin-form-group">
					<div className="admin-form-subgroup">
						<label htmlFor="new-description" className="dashboard-label">
							Descripción
							<span>{data.description.length}</span>
						</label>
						<textarea
							id="new-description"
							name="description"
							rows="3"
							value={data.description}
							onChange={handleInputChange}
							required
						/>
					</div>
					<div className="admin-form-subgroup img-subgroup">
						<div className="admin-service-img-wrapper">
							<small className="img-placeholder">
								<i className="fas fa-camera" />
							</small>
							<button
								type="button"
								className="edit-img"
								onClick={() => {
									return;
								}}>
								<i className="fas fa-camera" />
							</button>
						</div>
					</div>
				</div>
				<div className="admin-form-group">
					<div className="admin-form-subgroup">
						<span className="admin-form-subgroup-title">
							Es necesario agregar un <i>código de artículo</i> que permitirá a tus clientes pagar online.
						</span>
						<label className="dashboard-label" htmlFor="new-sku">
							Sku (código de artículo)
						</label>
						<div className="dashboard-input">
							<input
								id="new-sku"
								type="text"
								name="sku"
								maxLength="150"
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
				<div className="admin-form-group">
					<div className="admin-form-subgroup">
						<span className="admin-form-subgroup-title">
							Activar esta opción permitirá a tus clientes reservar el servicio.
						</span>
						<div className="form-check form-switch">
							<label
								className="form-check-label"
								htmlFor="new_is_active"
								data-tooltip={
									schedule
										? "Permite que se pueda reservar este servicio"
										: "Primero define un horario en el apartado de negocio"
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
				<div>
					<button type="submit" className="btn-cool">
						Añadir
					</button>
				</div>
			</form>
		</div>
	);
};
