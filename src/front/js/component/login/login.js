import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext";
import { Redirect } from "react-router-dom";

export const Login = () => {
	const { actions, store } = useContext(Context);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<div className="container-fluid my-auto mb-md-auto mt-md-4">
			<div className="row">
				<div className="col mx-4 mb-4" style={{ display: "grid", gap: "1rem" }}>
					<input
						autoFocus
						required
						onChange={e => {
							setEmail(e.target.value);
						}}
						className="form-control"
						type="mail"
						id="email"
						name="email"
						placeholder="email"
					/>
					<input
						required
						onChange={e => {
							setPassword(e.target.value);
						}}
						className="form-control"
						type="password"
						id="password"
						name="password"
						placeholder="password"
					/>
					<button
						onClick={() => {
							actions.generate_token(email, password);
						}}
						className="btn btn-warning w-100"
						type="submit">
						Acceder
					</button>
					<div className="d-flex w-100 justify-content-center">
						¿Aún no eres miembro?&nbsp;
						<button className="text-primary" onClick={() => actions.setPopup("signup", "Únete")}>
							Únete ahora
						</button>
					</div>
					<div className="d-flex w-100 justify-content-center">
						<button className="text-primary" onClick={() => actions.setPopup("guest", "Invitado")}>
							Seguir como invitado
						</button>
					</div>
				</div>
				{store.user.is_admin ? <Redirect to="/admin" /> : null}
				{store.user.token ? (
					actions.closePopup()
				) : (
					<div>
						{store.message != "" ? (
							<div className="alert alert-danger" role="alert">
								{store.message}
							</div>
						) : (
							""
						)}
					</div>
				)}
			</div>
		</div>
	);
};
