import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext";
import { Link } from "react-router-dom";

export const Signup = () => {
	const { actions, store } = useContext(Context);
	const [files, setFiles] = useState(null);

	const [data, setData] = useState({
		name: "",
		lastname: "",
		email: "",
		password: ""
	});

	const submitForm = event => {
		event.preventDefault();

		// we are about to send this to the backend.
		console.log("This are the files", files);
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
		<div className="container-fluid">
			<div className="row">
				<form onSubmit={submitForm} className="col-10 mx-auto mb-4" style={{ display: "grid", gap: "1rem" }}>
					<input
						required
						onChange={e => {
							handleInputChange(e);
						}}
						className="form-control"
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
						className="form-control"
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
						className="form-control"
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
						className="form-control"
						type="password"
						id="password"
						name="password"
						placeholder="password"
					/>

					<input
						type="file"
						// accept=".jpg/.png"
						onChange={e => {
							setFiles(e.target.files);
						}}
					/>
					<button className="btn btn-warning w-100" type="submit">
						Únete
					</button>
					<div className="d-flex w-100 justify-content-center">
						¿Ya eres miembro?&nbsp;
						<button className="text-primary" onClick={() => actions.setPopup("login")}>
							Iniciar Sesión
						</button>
					</div>
				</form>
				{store.message ? (
					<div className={`alert alert-${store.message != "" ? "success" : "danger"}`} role="alert">
						{store.message != "" ? store.message : ""}
					</div>
				) : (
					""
				)}
			</div>
		</div>
	);
};
