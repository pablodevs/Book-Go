import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

export const AccountSettings = () => {
	const { actions, store } = useContext(Context);

	const [data, setData] = useState({
		id: null,
		name: null,
		lastname: null,
		email: null,
		phone: null
	});

	useEffect(
		() => {
			setData({
				id: store.user.id,
				name: store.user.name.charAt(0).toUpperCase() + store.user.name.slice(1),
				lastname: store.user.lastname.charAt(0).toUpperCase() + store.user.lastname.slice(1),
				email: store.user.email,
				phone: store.user.phone
			});
		},
		[store.user]
	);

	const submitForm = event => {
		event.preventDefault();

		let body = new FormData();
		body.append("id", data.id);
		body.append("name", data.name);
		body.append("lastname", data.lastname);
		body.append("email", data.email);
		body.append("phone", data.phone);

		actions.setToast(
			"promise",
			{ loading: "Guardando...", success: "Cambios guardados" },
			actions.updateUser(body),
			"toast-success"
		);
	};

	const handleInputChange = e => {
		setData({
			...data,
			[e.target.name]: e.target.value
		});
	};

	return (
		<div className="dashboard-content-wrapper">
			<h1 className="dashboard-content-title">Cuenta y Configuración</h1>
			<form onSubmit={submitForm} className="dashboard-form">
				<h2 className="dashboard-content-subtitle">Detalles de la cuenta</h2>
				<div>
					<label className="dashboard-label" htmlFor="update-name">
						Nombre
					</label>
					<div className="dashboard-input">
						<input
							onChange={e => {
								handleInputChange(e);
							}}
							type="text"
							id="update-name"
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
					<label className="dashboard-label" htmlFor="update-lastname">
						Apellido
					</label>
					<div className="dashboard-input">
						<input
							onChange={e => {
								handleInputChange(e);
							}}
							type="text"
							id="update-lastname"
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
					<label className="dashboard-label" htmlFor="update-email">
						Email
					</label>
					<div className="dashboard-input">
						<input
							onChange={e => {
								handleInputChange(e);
							}}
							type="mail"
							id="update-email"
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
					<label className="dashboard-label" htmlFor="update-phone">
						Número de teléfono
					</label>
					<div className="dashboard-input">
						<input
							onChange={handleInputChange}
							type="tel"
							id="update-phone"
							name="phone"
							value={data.phone || ""}
							minLength="9"
							maxLength="9"
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
					<span className="admin-form-subgroup-title">¿Has olvidado la contraseña?</span>
					<div>
						<label htmlFor="update-password" className="dashboard-label">
							Contraseña
						</label>
						<button type="button" id="update-password" className="input-button">
							Cambiar contraseña
						</button>
					</div>
				</div>
				<div>
					<button type="submit" className="btn-cool">
						Guardar cambios
					</button>
				</div>
			</form>
			<button
				className="delete-account"
				onClick={() => {
					const deleteFunct = () => actions.deleteUser();
					actions.setPopup(
						"confirm",
						"Eliminar cuenta",
						{
							button: "Eliminar",
							toast: {
								success: "Cuenta eliminada",
								loading: "Eliminando..."
							},
							message: "Esta acción no podrá deshacerse. Si aceptas perderás todas tus reservas y datos."
						},
						deleteFunct
					);
				}}>
				<i className="fas fa-ban" />
				<span>Eliminar cuenta</span>
			</button>
		</div>
	);
};
