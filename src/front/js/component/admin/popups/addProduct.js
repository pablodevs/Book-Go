import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../store/appContext";

export const AddProduct = () => {
	const { actions, store } = useContext(Context);

	const [minutesList, setMinutesList] = useState([]);
	const [hoursList, setHoursList] = useState([]);
	const [minutes, setMinutes] = useState(0);
	const [hours, setHours] = useState(0);
	const [data, setData] = useState({
		name: "",
		price: "",
		description: "",
		duration: ""
		// product_img_url: "",
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
		if (data.name !== "" && data.price !== "" && data.description !== "") {
			actions.setToast(
				"promise",
				{ loading: "Añadiendo...", success: resp => `Producto agregado: ${resp.name}` },
				actions.addProduct(data),
				"toast-confirm"
			);
		}
	};

	return (
		<div className="popup-body">
			<form onSubmit={handleSubmit} className="dashboard-form">
				<p>Puedes modificar la información del producto más adelante</p>
				<div className="admin-form-group">
					<div className="admin-form-subgroup">
						<label className="dashboard-label" htmlFor="new-product">
							Nuevo producto:
							<span>{data.name.length}</span>
						</label>
						<div className="dashboard-input">
							<input
								id="new-product"
								type="text"
								name="name"
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
					<div className="admin-form-subgroup price-subgroup">
						<label className="dashboard-label" htmlFor="new-price">
							Precio
						</label>
						<div className="price-input">
							<input
								type="number"
								id="new-price"
								name="price"
								min="0"
								onChange={e => handleInputChange(e)}
								value={data.price}
								required
							/>
							<span>€</span>
						</div>
					</div>
					<div className="admin-form-subgroup">
						Duración
						<label htmlFor="new-hours" className="dashboard-label">
							Hora(s)
						</label>
						<div className="select-wrapper">
							<select onChange={e => setHours(parseInt(e.target.value))} id="new-hours" value={hours}>
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
					<div className="admin-form-subgroup img-subgroup">
						<div className="admin-product-img-wrapper">
							<small className="img-placeholder">
								<i className="fas fa-camera" />
							</small>
							<button type="button" className="edit-img" onClick={() => undefined}>
								<i className="fas fa-camera" />
							</button>
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
							onChange={e => handleInputChange(e)}
							required
						/>
					</div>
				</div>
				<div>
					<button type="submit" className="save-button">
						Añadir
					</button>
				</div>
			</form>
		</div>
	);
};
