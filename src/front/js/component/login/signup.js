import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext";
import { CloudinaryUploadWidget } from "../cloudinary/cloudinaryUploadWidget";
import { WidgetButton } from "../cloudinary/widgetButton";

export const Signup = () => {
	const { actions, store } = useContext(Context);
	const [files, setFiles] = useState(null);

	const [data, setData] = useState({
		name: "",
		lastname: "",
		email: "",
		phone: "",
		password: ""
	});

	const handleSubmit = event => {
		event.preventDefault();

		// we are about to send this to the backend.
		let body = new FormData();
		body.append("email", data.email);
		body.append("password", data.password);
		body.append("name", data.name);
		body.append("lastname", data.lastname);
		body.append("phone", data.phone);
		if (store.image_url) body.append("profile_image_url", store.image_url);
		// if (files) body.append("profile_image_url", files[0]);
		actions.createUser(body);
	};

	const handleInputChange = e => {
		setData({
			...data,
			[e.target.name]: e.target.value
		});
	};

	return (
		<div className="container-fluid popup-container">
			<div className="row popup-row">
				<form onSubmit={handleSubmit}>
					<div className="col mx-4 mb-4" style={{ display: "grid", gap: "1rem" }}>
						<div>
							<label htmlFor="name">Nombre</label>
							<input autoFocus required onChange={handleInputChange} type="text" id="name" name="name" />
						</div>
						<div>
							<label htmlFor="lastname">Apellidos</label>
							<input required onChange={handleInputChange} type="text" id="lastname" name="lastname" />
						</div>
						<div>
							<label htmlFor="phone">Teléfono</label>
							<input
								required
								onChange={handleInputChange}
								type="tel"
								id="phone"
								name="phone"
								minLength="9"
								maxLength="9"
							/>
						</div>
						<div>
							<label htmlFor="email">E-mail</label>
							<input
								required
								onChange={handleInputChange}
								type="email"
								id="email"
								name="email"
								placeholder="name@example.com"
							/>
						</div>
						<div>
							<label htmlFor="password">Contraseña</label>
							<input
								required
								onChange={handleInputChange}
								type="password"
								id="password"
								name="password"
							/>
						</div>
						<span className="text-center">También puedes añadir una foto de perfil</span>
						<CloudinaryUploadWidget
							preset="client_images"
							defaultComp={<WidgetButton title="Subir imagen" funct={() => actions.setWidget(true)} />}
							loadingComp={
								<div className="input-button">
									<div className="spinner-border spinner-border-sm" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
								</div>
							}
							successComp={
								<div className="input-button">
									<i className="fas fa-camera" />
									<i className="far fa-check-circle" style={{ color: "rgb(21, 215, 21)" }} />
								</div>
							}
						/>
						<button className="save-button" type="submit">
							Únete
						</button>
						<div className="d-flex w-100 justify-content-center">
							¿Ya eres miembro?&nbsp;
							<button className="text-primary" onClick={() => actions.goToPrevPopup()}>
								Iniciar Sesión
							</button>
						</div>
					</div>
					{store.message.message ? (
						<div className={`alert alert-${store.message.status}`} role="alert">
							{store.message.message}
						</div>
					) : null}
				</form>
			</div>
		</div>
	);
};
