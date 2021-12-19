import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import { Context } from "../store/appContext";
import home from "../../img/dashboard/home_transparent.png";
import "../../styles/pages/dashboard.scss";
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
						<img src={home} width="100" height="100" style={{ filter: "opacity(15%)" }} />
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
					<h1 className="dashboard-username">
						{store.user.name.charAt(0).toUpperCase() +
							store.user.name.slice(1) +
							" " +
							store.user.lastname.charAt(0).toUpperCase() +
							store.user.lastname.slice(1)}
					</h1>
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
