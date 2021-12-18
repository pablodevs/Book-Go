import React, { useContext, useState } from "react";
import { Context } from "../../../store/appContext";

export const UserFromGuest = () => {
	const { actions, store } = useContext(Context);
	const [files, setFiles] = useState(null);

	const [data, setData] = useState({
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
		body.append("phone", data.phone);
	};

	const handleInputChange = e => {
		setData({
			...data,
			[e.target.name]: e.target.value
		});
	};

	return (
		<div className="container-fluid my-auto">
			<div className="row">
				<form onSubmit={submitForm} className="col mx-4 mb-4" style={{ display: "grid", gap: "1rem" }}>
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
					<button className="btn btn-warning w-100" type="submit" onClick={() => actions.setPopup("", "")}>
						Confirmar
					</button>
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
