import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext";

export const Login = () => {
	const { actions, store } = useContext(Context);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-10 mx-auto mb-4" style={{ display: "grid", gap: "1rem" }}>
					<input
						onChange={e => {
							setEmail(e.target.value);
							// ⚠️NO FUNCIONA, NO EXISTE LA FUNCIÓN CHANGEMESSAGE⚠️
							// actions.changeMessage({ message: "Tic.tac.tic.tac..." });
						}}
						className="form-control"
						type="mail"
						id="email"
						name="email"
						placeholder="email"
					/>
					<input
						onChange={e => {
							setPassword(e.target.value);
							// ⚠️NO FUNCIONA, NO EXISTE LA FUNCIÓN CHANGEMESSAGE⚠️
							// actions.changeMessage({ message: "Tic.tac.tic.tac..." });
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
						<button className="text-primary" onClick={() => actions.setPopup("signup")}>
							Únete ahora
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
