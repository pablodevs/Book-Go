import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

export const DashboardAccount = () => {
	const { actions, store } = useContext(Context);
	const [files, setFiles] = useState(null);

	const [data, setData] = useState({
		name: "",
		lastname: "",
		email: "",
		password: ""
	});

	useEffect(() => {
		setData({
			...data,
			[e.target.name]: store.user.name.charAt(0).toUpperCase() + store.user.name.slice(1),
			[e.target.lastname]: store.user.lastname.charAt(0).toUpperCase() + store.user.lastname.slice(1),
			[e.target.email]: store.user.email
		});
	}, []);

	const submitForm = event => {
		event.preventDefault();

		// we are about to send this to the backend.
		let body = new FormData();
		body.append("name", data.name);
		body.append("lastname", data.lastname);
		body.append("email", data.email);
		body.append("password", data.password);
		if (files != null) {
			body.append("profile_image", files[0]);
		}
		actions.createUser(body);
	};

	const handleInputChange = e => {
		setData({
			...data,
			[e.target.name]: e.target.value
		});
	};

	return (
		<div className="dashboard-account-wrapper">
			<h1>Cuenta & Configuración</h1>
			<h4>Detalles</h4>
			<div>
				<label className="dashboard-label" htmlFor="name">
					Nombre
				</label>
				<input
					required
					onChange={e => {
						handleInputChange(e);
					}}
					type="text"
					id="name"
					name="name"
					value={store.user.name.charAt(0).toUpperCase() + store.user.name.slice(1)}
					placeholder="Nombre"
				/>
			</div>
			<div>
				<label className="dashboard-label" htmlFor="lastname">
					Apellido
				</label>
				<input
					required
					onChange={e => {
						handleInputChange(e);
					}}
					type="text"
					id="lastname"
					name="lastname"
					value={store.user.lastname.charAt(0).toUpperCase() + store.user.lastname.slice(1)}
					placeholder="Apellido"
				/>
			</div>
			<div>
				<label className="dashboard-label" htmlFor="email">
					Email
				</label>
				<input
					required
					onChange={e => {
						handleInputChange(e);
					}}
					type="mail"
					id="email"
					name="email"
					value={store.user.email}
					placeholder="Email"
				/>
			</div>
			<div>
				<label className="dashboard-label" htmlFor="phone">
					Número de teléfono
				</label>
				<input
					required
					onChange={e => {
						handleInputChange(e);
					}}
					type="tel"
					id="phone"
					name="phone"
					value={store.user.phone}
					placeholder="Número de teléfono"
				/>
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
		</div>
	);
};
