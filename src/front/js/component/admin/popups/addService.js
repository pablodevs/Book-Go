import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../store/appContext";

export const AddService = () => {
	const { actions, store } = useContext(Context);

	const [minutesList, setMinutesList] = useState([]);
	const [hoursList, setHoursList] = useState([]);
	const [minutes, setMinutes] = useState(0);
	const [hours, setHours] = useState(0);
	const [data, setData] = useState({
		name: store.serviceInProgress.name || "",
		price: store.serviceInProgress.price || "",
		description: store.serviceInProgress.description || "",
		duration: store.serviceInProgress.duration || ""
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
	}, []);

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
		actions.updateServiceInProgress(data);
		actions.setPopup("add-service2", "Cambiar foto de servicio");
	};

	return (
		<div className="popup-body">
			<form onSubmit={handleSubmit} className="dashboard-form popup-form">
				<p>
					Podrás modificar la información del servicio más adelante.
					<br />
					Primero introduce un <strong>Nombre</strong> para el servicio.
				</p>
				<div className="admin-form-group">
					<div className="admin-form-subgroup">
						<div className="input-wrapper">
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
							<label className="dashboard-label" htmlFor="new-service">
								Nombre:
							</label>
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
				<p>
					Añade el <strong>Precio</strong> y la <strong>Duración</strong> del servicio
				</p>
				<div className="admin-form-group">
					<div className="admin-form-subgroup duration-subgroup">
						<div className="dflex-row">
							<div>
								<div className="input-wrapper price-input">
									<input
										type="number"
										id="new-price"
										name="price"
										min="0"
										onChange={handleInputChange}
										value={data.price}
										required
									/>
									<span className="center">€</span>
									<label className="dashboard-label" htmlFor="new-price">
										Precio
									</label>
								</div>
							</div>
							<div>
								<div className="select-wrapper input-wrapper">
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
									<label htmlFor="new-hours" className="dashboard-label">
										Hora(s)
									</label>
								</div>
								<div className="select-wrapper input-wrapper">
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
									<label htmlFor="new-minutes" className="dashboard-label">
										Minutos
									</label>
								</div>
							</div>
						</div>
					</div>
				</div>
				<p>
					Por último agrega una descripción <strong>descripción</strong>
				</p>
				<div className="admin-form-group">
					<div className="admin-form-subgroup input-wrapper">
						<textarea
							id="new-description"
							name="description"
							rows="3"
							value={data.description}
							onChange={handleInputChange}
							required
						/>
						<label htmlFor="new-description" className="dashboard-label">
							Descripción
						</label>
					</div>
				</div>
				<div>
					<button type="submit" className="btn-cool">
						Continuar
					</button>
				</div>
			</form>
		</div>
	);
};
