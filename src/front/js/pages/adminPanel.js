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
					<div className="center dashboard-welcome">
						<h2>¡Hola {store.user.name.charAt(0).toUpperCase() + store.user.name.slice(1)}!</h2>
						<img src={gears} height="100" />
					</div>
			  )
			: null;
	}, []);

	return !store.user.token && !store.user.is_admin ? (
		<Redirect to="/" />
	) : (
		<div className="dashboard-wrapper admin-panel">
			<aside className="dashboard-aside admin-aside">
				<div className="dashboard-user-info">
					<h1 className="dashboard-username admin-logo">Admin Panel</h1>
				</div>
				<nav>
					<ul>
						<li className="dashboard-li">
							<button
								className="dashboard-tab"
								onClick={() =>
									setContent(
										// Aquí iría un <Componente/> con el contenido que queramos mostrar en cada caso
										<div className="dashboard-content-wrapper">
											<h1 className="dashboard-content-title">Productos y Disponibilidad</h1>
										</div>
									)
								}>
								Productos y Disponibilidad
							</button>
						</li>
						<li className="dashboard-li">
							<button
								className="dashboard-tab"
								onClick={() =>
									setContent(
										// Aquí iría un <Componente/> con el contenido que queramos mostrar en cada caso
										<div className="dashboard-content-wrapper">
											<h1 className="dashboard-content-title">Estadísticas</h1>
										</div>
									)
								}>
								Estadísticas
							</button>
						</li>
						<li className="dashboard-li">
							<button
								className="dashboard-tab"
								onClick={() =>
									setContent(
										// Aquí iría un <Componente/> con el contenido que queramos mostrar en cada caso
										<div className="dashboard-content-wrapper">
											<h1 className="dashboard-content-title">Cuenta y Configuración</h1>
										</div>
									)
								}>
								Cuenta y Configuración
							</button>
						</li>
						<li className="admin-logout">
							<button className="logout coolbtn" onClick={() => actions.logout()}>
								<span>Salir</span>
								<i className="fas fa-sign-out-alt" />
							</button>
						</li>
					</ul>
				</nav>
			</aside>
			<section className="dashboard-content admin-content">{content}</section>
		</div>
	);
};
