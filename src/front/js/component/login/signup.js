import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext";
import { Link } from "react-router-dom";

export const Signup = () => {
	const { actions, store } = useContext(Context);

	const [data, setData] = useState({
		email: "",
		password: ""
	});

	const submitForm = event => {
		event.preventDefault();
		actions.createUser(data);
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
				<h1 className="text-center text-warning mt-5 p-4">Sign Up Form !</h1>
				<div className="col-auto mx-auto  border border-success p-5 m-3">
					<form onSubmit={submitForm}>
						<input
							onChange={e => {
								handleInputChange(e);
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
								handleInputChange(e);
								// actions.changeMessage({ message: "Tic.tac.tic.tac..." });
							}}
							className="form-control"
							type="password"
							id="password"
							name="password"
							placeholder="password"
						/>

						<button className="btn btn-warning mt-3 border-success mb-3" type="submit">
							Bienvenido !
						</button>
						<Link to="/login">
							<button className="btn btn-primary m-3 border-success ml-auto">Volver al Login !</button>
						</Link>
					</form>
					{/* <div
						className={`alert alert-${
							store.msg.text == "User Created !" || store.msg.text == "" ? "info" : "danger"
						}`}
						role="alert">
						{store.msg.show == true ? store.msg.text : store.message}
					</div> */}
				</div>
			</div>
		</div>
	);
};
