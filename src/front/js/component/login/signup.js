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
		<div className="container">
			<div className="row">
				<h1 className="text-center text-warning mt-5 p-4">Regístrate en nuestra Web !</h1>
				<div className="col-auto mx-auto  border border-success p-5 m-3">
					<form onSubmit={submitForm}>
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
							className="form-control mt-2"
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
							className="form-control mt-2"
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
							className="form-control mt-2"
							type="password"
							id="password"
							name="password"
							placeholder="password"
						/>

						<input
							type="file"
							// accept=".jpg/.png"
							className="mt-2"
							onChange={e => {
								setFiles(e.target.files);
							}}
						/>
						<div className="mt-2">
							<button className="btn btn-warning mt-3 border-success mb-3" type="submit">
								Enviar
							</button>
							<Link to="/login">
								<button className="btn btn-primary m-3 border-success ml-auto">
									Volver al Login !
								</button>
							</Link>
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
		</div>
	);
};
