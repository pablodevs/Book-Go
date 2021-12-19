import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import { Context } from "../store/appContext";
import gears from "../../img/dashboard/gears.png";
import "../../styles/pages/adminPanel.scss";

export const AdminPanel = () => {
	const { actions, store } = useContext(Context);
	let [content, setContent] = useState(null);

	useEffect(() => {
		store.user.name
			? setContent(
					<div
						className="center"
						style={{ flexDirection: "column", gap: "1.3rem", marginInline: "auto", color: "lightgray" }}>
						<h2>¡Hola {store.user.name.charAt(0).toUpperCase() + store.user.name.slice(1)}!</h2>
						<img src={gears} height="100" style={{ filter: "opacity(15%)" }} />
					</div>
			  )
			: null;
	}, []);

	return !store.user.token && !store.user.is_admin ? (
		<Redirect to="/" />
	) : (
		<div className="dashboard-wrapper admin-panel">
			<aside className="dashboard-aside">
				<div className="dashboard-user-info">
					<h1 className="dashboard-username admin-logo">Admin Panel</h1>
				</div>
				<nav>
					<ul>
						<li>
							<button onClick={() => undefined}>Reservas</button>
						</li>
						<li>
							<button onClick={() => undefined}>Cuenta y Configuración</button>
						</li>
						<li>
							<button className="logout" onClick={() => actions.logout()}>
								Salir
							</button>
						</li>
					</ul>
				</nav>
			</aside>
			<secction className="dashboard-content">{content}</secction>
		</div>
	);
};
