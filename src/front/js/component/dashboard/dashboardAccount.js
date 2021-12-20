import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

export const DashboardAccount = () => {
	const { actions, store } = useContext(Context);

	const [data, setData] = useState({
		name: null,
		lastname: null,
		email: null,
		phone: null
	});

	useEffect(
		() => {
			setData({
				name: store.user.name.charAt(0).toUpperCase() + store.user.name.slice(1),
				lastname: store.user.lastname.charAt(0).toUpperCase() + store.user.lastname.slice(1),
				email: store.user.email,
				phone: store.user.phone
				// img_url: store.user.img_url
			});
		},
		[store.user]
	);

	const submitForm = event => {
		event.preventDefault();
		actions.updateUser(data);
	};

	const handleInputChange = e => {
		setData({
			...data,
			[e.target.name]: e.target.value
		});
	};

	return (
		<form onSubmit={submitForm} className="dashboard-content-wrapper dashboard-forms">
			<h1 className="dashboard-content-title">Cuenta y Configuración</h1>
			<div>
				<label className="dashboard-label" htmlFor="name">
					Nombre
				</label>
				<div className="dashboard-input">
					<input
						onChange={e => {
							handleInputChange(e);
						}}
						type="text"
						id="name"
						name="name"
						value={data.name || ""}
						placeholder="Nombre"
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
			<div>
				<label className="dashboard-label" htmlFor="lastname">
					Apellido
				</label>
				<div className="dashboard-input">
					<input
						onChange={e => {
							handleInputChange(e);
						}}
						type="text"
						id="lastname"
						name="lastname"
						value={data.lastname || ""}
						placeholder="Apellidos"
					/>
					<button
						type="button"
						className="clear-input"
						onClick={() =>
							setData({
								...data,
								lastname: ""
							})
						}>
						<i className="fas fa-times" />
					</button>
				</div>
			</div>
			<div>
				<label className="dashboard-label" htmlFor="email">
					Email
				</label>
				<div className="dashboard-input">
					<input
						onChange={e => {
							handleInputChange(e);
						}}
						type="mail"
						id="email"
						name="email"
						value={data.email || ""}
						placeholder="Email"
					/>
					<button
						type="button"
						className="clear-input"
						onClick={() =>
							setData({
								...data,
								email: ""
							})
						}>
						<i className="fas fa-times" />
					</button>
				</div>
			</div>
			<div>
				<label className="dashboard-label" htmlFor="phone">
					Número de teléfono
				</label>
				<div className="dashboard-input">
					<input
						onChange={e => {
							if (e.target.value.length > 9) e.target.classList.add("input-error");
							else e.target.classList.remove("input-error");
							handleInputChange(e);
						}}
						type="tel"
						id="phone"
						name="phone"
						value={data.phone || ""}
						placeholder="Número de teléfono"
					/>
					<button
						type="button"
						className="clear-input"
						onClick={() =>
							setData({
								...data,
								phone: ""
							})
						}>
						<i className="fas fa-times" />
					</button>
				</div>
			</div>
			<div>
				<p className="dashboard-label">Contraseña</p>
				<button className="change-password">Cambiar contraseña</button>
			</div>
			<div>
				<button type="submit" className="save-button">
					Guardar cambios
				</button>
			</div>
		</form>
	);
};
