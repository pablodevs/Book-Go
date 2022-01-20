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

	const handleSubmit = e => {
		e.preventDefault();
		actions.generate_token(email, password);
	};

	return (
		<div className="container-fluid popup-container">
			<div className="row popup-row">
				<form onSubmit={handleSubmit}>
					<div className="col mx-4 mb-4" style={{ display: "grid", gap: "1rem" }}>
						<div>
							<label htmlFor="loginemail">E-mail</label>
							<input
								autoFocus
								required
								onChange={e => {
									setEmail(e.target.value);
								}}
								type="mail"
								id="loginemail"
								name="email"
								placeholder="name@example.com"
							/>
						</div>
						<div>
							<label htmlFor="loginpassword">Contraseña</label>
							<input
								required
								onChange={e => {
									setPassword(e.target.value);
								}}
								type="password"
								id="loginpassword"
								name="password"
							/>
						</div>
						<button className="btn-cool" type="submit">
							Acceder
						</button>
						<div className="d-flex flex-wrap w-100 justify-content-center">
							¿Aún no eres miembro?&nbsp;
							<button
								className="text-primary"
								type="button"
								onClick={() => actions.setPopup("signup", "Únete")}>
								Únete ahora
							</button>
						</div>
						{/* <div className="d-flex w-100 justify-content-center">
						<button className="text-primary" onClick={() => actions.setPopup("guest", "Invitado")}>
							Seguir como invitado
						</button>
					</div> */}
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
