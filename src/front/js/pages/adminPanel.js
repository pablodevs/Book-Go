import React, { useState, useEffect, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { Context } from "../store/appContext";
import { AdminProducts } from "../component/admin/adminProducts";
import { AccountSettings } from "../component/dashboard/accountSettings";
import gears from "../../img/dashboard/gears.png";
import "../../styles/pages/adminPanel.scss";

export const AdminPanel = () => {
	const { actions, store } = useContext(Context);
	let [content, setContent] = useState(null);

	useEffect(() => {
		store.user.name
			? setContent(
					<div className="center dashboard-welcome">
						<span>¡Hola {store.user.name.charAt(0).toUpperCase() + store.user.name.slice(1)}!</span>
						<img src={gears} height="100" />
					</div>
			  )
			: null;
	}, []);

	return !store.user.token && !store.user.is_admin ? (
		<Redirect to="/" />
	) : (
		<main className="admin-panel-wrapper">
			<div className="dashboard-wrapper admin-panel">
				<aside className="dashboard-aside admin-aside">
					<div className="dashboard-user-info">
						<h1 className="dashboard-username admin-logo">Admin Panel</h1>
					</div>
					<nav>
						<ul>
							{/* ⚠️ Reorganizar en pantallas pequeñas para que se vean en horizontal */}
							<li className="dashboard-li">
								<button className="dashboard-tab" onClick={() => setContent(<AdminProducts />)}>
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
								<button className="dashboard-tab" onClick={() => setContent(<AccountSettings />)}>
									Cuenta y Configuración
								</button>
							</li>
							<li className="admin-logout">
								<button className="logout coolbtn" onClick={() => actions.logout()}>
									<span>Salir</span>
									<i className="fas fa-sign-out-alt" />
								</button>
								<Link className="coolbtn" to="/">
									{/* style={{ fontSize: "1.15rem" }}> */}
									Home
								</Link>
							</li>
						</ul>
					</nav>
				</aside>
				<section className="dashboard-content admin-content">{content}</section>
			</div>
		</main>
	);
};
