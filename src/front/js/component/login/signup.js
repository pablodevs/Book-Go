import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext";
import { CloudinaryUploadWidget } from "../cloudinary/cloudinaryUploadWidget";

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
		console.log("This are the files", files);
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
				<form onSubmit={handleSubmit} className="col mx-4 mb-4" style={{ display: "grid", gap: "1rem" }}>
					<input
						autoFocus
						required
						onChange={e => {
							handleInputChange(e);
						}}
						type="text"
						id="name"
						name="name"
						placeholder="Nombre..."
					/>
					<input
						required
						onChange={e => {
							handleInputChange(e);
						}}
						type="text"
						id="lastname"
						name="lastname"
						placeholder="Apellidos..."
					/>
					<input
						required
						onChange={e => {
							handleInputChange(e);
						}}
						type="phone"
						id="phone"
						name="phone"
						placeholder="Teléfono..."
					/>
					<input
						required
						onChange={e => {
							handleInputChange(e);
						}}
						type="mail"
						id="email"
						name="email"
						placeholder="Correo electrónico"
					/>
					<input
						required
						onChange={e => {
							handleInputChange(e);
						}}
						type="password"
						id="password"
						name="password"
						placeholder="password"
					/>
					<span className="text-center">También puedes añadir una foto de perfil</span>
					<CloudinaryUploadWidget title="Subir imagen" preset="client_images" />
					{/* <label htmlFor="profileImg" className="input-button">
						<input
							type="file"
							id="profileImg"
							accept=".jpg, .jpeg, .png"
							onChange={e => {
								setFiles(e.target.files);
							}}
						/>
						<i className="fas fa-camera" />
						Añade una imagen de perfil
					</label> */}
					<button className="save-button" type="submit">
						Únete
					</button>
					<div className="d-flex w-100 justify-content-center">
						¿Ya eres miembro?&nbsp;
						<button className="text-primary" onClick={() => actions.goToPrevPopup()}>
							Iniciar Sesión
						</button>
					</div>
					{store.message ? (
						<div className={`alert alert-${store.message != "" ? "success" : "danger"}`} role="alert">
							{store.message != "" ? store.message : ""}
						</div>
					) : (
						""
					)}
				</form>
			</div>
		</div>
	);
};
