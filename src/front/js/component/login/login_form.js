import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext";

export const Login_form = () => {
	const { actions, store } = useContext(Context);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<div className="container">
			<div className="row">
				<div className="col-11 mx-auto m-5  p-4 border border-success border-rounded">
					<input
						onChange={e => {
							setEmail(e.target.value);
							actions.changeMessage({ message: "Tic.tac.tic.tac..." });
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
							actions.changeMessage({ message: "Tic.tac.tic.tac..." });
						}}
						className="form-control"
						type="password"
						id="password"
						name="password"
						placeholder="password"
					/>

					<p className="text-end text-primary">Regístrate!</p>

					<button
						onClick={() => {
							actions.generate_token(email, password);
						}}
						className="btn btn-warning mt-3 border-success"
						type="submit">
						Enviar !
					</button>
				</div>
			</div>
		</div>
	);
};
