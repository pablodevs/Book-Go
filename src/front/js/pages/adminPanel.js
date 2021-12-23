import React, { useState, useEffect, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { Context } from "../store/appContext";
import { ClientList } from "../component/admin/clientList";
import { AdminProducts } from "../component/admin/adminProducts";
import { BusinessSettings } from "../component/admin/businessSettings";
import { AccountSettings } from "../component/dashboard/accountSettings";
import gears from "../../img/dashboard/gears.png";
import "../../styles/pages/adminPanel.scss";

export const AdminPanel = () => {
	const { actions, store } = useContext(Context);
	const [content, setContent] = useState(null);
	const [activeTab, setActiveTab] = useState("");

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
								<button
									className={"dashboard-tab" + (activeTab === "Reservas" ? " tab-active" : "")}
									onClick={() => {
										setActiveTab("Reservas");
										setContent(
											<div className="dashboard-content-wrapper admin-products">
												<h1 className="dashboard-content-title">Próximas reservas</h1>
											</div>
										);
									}}>
									<i className="far fa-calendar-alt" />
									<span>Reservas</span>
								</button>
							</li>
							<li className="dashboard-li">
								<button
									className={"dashboard-tab" + (activeTab === "Clientes" ? " tab-active" : "")}
									onClick={() => {
										setActiveTab("Clientes");
										setContent(<ClientList />);
									}}>
									<i className="fas fa-user-friends" />
									<span>Clientes</span>
								</button>
							</li>
							<li className="dashboard-li">
								<button
									className={"dashboard-tab" + (activeTab === "Estadísticas" ? " tab-active" : "")}
									onClick={() => {
										setActiveTab("Estadísticas");
										setContent(
											// Aquí iría un <Componente/> con el contenido que queramos mostrar en cada caso
											<div className="dashboard-content-wrapper">
												<h1 className="dashboard-content-title">Estadísticas</h1>
											</div>
										);
									}}>
									<i className="far fa-chart-bar" />
									<span>Estadísticas</span>
								</button>
							</li>
							<li className="dashboard-li">
								<button
									className={"dashboard-tab" + (activeTab === "Productos" ? " tab-active" : "")}
									onClick={() => {
										setActiveTab("Productos");
										setContent(<AdminProducts />);
									}}>
									<i className="fas fa-cog" />
									<span>Productos & Disponibilidad</span>
								</button>
							</li>
							<li className="dashboard-li">
								<button
									className={"dashboard-tab" + (activeTab === "Negocio" ? " tab-active" : "")}
									onClick={() => {
										setActiveTab("Negocio");
										setContent(
											<div className="dashboard-content-wrapper admin-products">
												<h1 className="dashboard-content-title">Configuración del negocio</h1>
												<BusinessSettings />
											</div>
										);
									}}>
									<i className="fas fa-store-alt" />
									<span>Negocio</span>
								</button>
							</li>
							<li className="dashboard-li">
								<button
									className={"dashboard-tab" + (activeTab === "Perfil" ? " tab-active" : "")}
									onClick={() => {
										setActiveTab("Perfil");
										setContent(
											<div className="dashboard-content-wrapper admin-products">
												<h1 className="dashboard-content-title">Configuración del perfil</h1>
												<AccountSettings />
											</div>
										);
									}}>
									<i className="fas fa-user" />
									<span>Perfil</span>
								</button>
							</li>
							<li className="admin-logout">
								<button className="logout btn-cool" onClick={() => actions.logout()}>
									<span>Salir</span>
									<i className="fas fa-sign-out-alt" />
								</button>
								<Link className="btn-cool" to="/">
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
