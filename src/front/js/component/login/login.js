import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Context } from "../../store/appContext";

export const Login = () => {
	const { actions, store } = useContext(Context);

	let history = useHistory();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	useEffect(
		() => {
			if (store.booking.id && store.user.id) actions.setPopup("resume", "Resumen de la reserva");
			if (store.user.id && store.user.is_admin) {
				history.push("/admin/welcome");
				actions.closePopup();
			}
		},
		[store.user]
	);

	return (
		<div className="container-fluid popup-container">
			<div className="row popup-row">
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
							actions.setToast(
								"promise",
								{ loading: "login...", success: () => "Bienvenido" },
								actions.generate_token(email, password),
								"toast-info"
							);
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
					{/* <div className="d-flex w-100 justify-content-center">
						<button className="text-primary" onClick={() => actions.setPopup("guest", "Invitado")}>
							Seguir como invitado
						</button>
					</div> */}
				</div>

				<div>
					{store.message != "" ? (
						<div className="alert alert-danger" role="alert">
							{store.message}
						</div>
					) : (
						""
					)}
				</div>
			</div>
		</div>
	);
};
