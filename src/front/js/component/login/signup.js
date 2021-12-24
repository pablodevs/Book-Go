import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext";

export const Signup = () => {
	const { actions, store } = useContext(Context);
	const [files, setFiles] = useState(null);

	const [data, setData] = useState({
		name: "",
		lastname: "",
		email: "",
		password: "",
		phone: ""
	});

	const submitForm = event => {
		event.preventDefault();
		actions.createUser(data, files);
	};

	const handleInputChange = e => {
		setData({
			...data,
			[e.target.name]: e.target.value
		});
	};

	return (
		<div className="container-fluid my-auto mb-md-auto mt-md-4">
			<div className="row">
				<form onSubmit={submitForm} className="col mx-4 mb-4" style={{ display: "grid", gap: "1rem" }}>
					<input
						autoFocus
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
						<button className="text-primary" onClick={() => actions.goToPrevPopup()}>
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
