import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext";

export const Guest = () => {
	const { actions, store } = useContext(Context);
	const [files, setFiles] = useState(null);

	const [data, setData] = useState({
		name: "",
		lastname: "",
		email: "",
		phone: ""
	});

	const submitForm = event => {
		event.preventDefault();

		// we are about to send this to the backend.
		// console.log("This are the files", files);
		let body = new FormData();
		body.append("name", data.name);
		body.append("lastname", data.lastname);
		body.append("email", data.email);
		body.append("phone", data.phone);
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
						required
						onChange={handleInputChange}
						type="text"
						id="guests-name"
						name="name"
						placeholder="Nombre..."
					/>

					<input
						required
						onChange={handleInputChange}
						type="text"
						id="guests-lastname"
						name="lastname"
						placeholder="Apellidos..."
					/>
					<input
						required
						onChange={handleInputChange}
						type="mail"
						id="guests-email"
						name="email"
						placeholder="Correo electrónico..."
					/>
					<input
						required
						onChange={handleInputChange}
						type="phone"
						id="guests-phone"
						name="phone"
						placeholder="Teléfono..."
					/>
					<button className="btn btn-warning w-100" type="submit">
						Confirmar
					</button>
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
