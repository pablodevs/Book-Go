import React, { useState, useEffect, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { Context } from "../store/appContext";
import { Reservations } from "../component/admin/reservations";
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
	const [showMenu, setShowMenu] = useState(false);

	const showWelcome = () => {
		store.user.name
			? setContent(
					<div className="center dashboard-welcome">
						<span>¡Hola {store.user.name.charAt(0).toUpperCase() + store.user.name.slice(1)}!</span>
						<img src={gears} height="100" />
					</div>
			  )
			: null;
	};

	useEffect(showWelcome, []);

	useEffect(() => {
		if (showMenu) {
			document.querySelector("html").style.position = "fixed";
			document.querySelector("html").style.overflowY = "scroll";
		} else {
			document.querySelector("html").style.position = "initial";
		}
	}, [showMenu]);

	return !store.token && !store.user.is_admin ? (
		<Redirect to="/" />
	) : (
		<main className="admin-panel-wrapper">
			<div className="admin-panel">
				<aside className="admin-aside">
					<div className="admin-aside-content">
						<div className="aside-toggle-wrapper">
							<button className="_navbar-toggle" onClick={() => setShowMenu(!showMenu)}>
								{showMenu ? <i className="fas fa-times" /> : <i className="fas fa-bars" />}
							</button>
						</div>
						<nav className={showMenu ? "show-menu" : ""}>
							<ul>
								<li>
									<button
										className={"admin-tab" + (activeTab === "Reservas" ? " tab-active" : "")}
										onClick={() => {
											setActiveTab("Reservas");
											setContent(<Reservations />);
											setShowMenu(false);
										}}>
										<i className="far fa-calendar-alt" />
										<span>Reservas</span>
									</button>
								</li>
								<li>
									<button
										className={"admin-tab" + (activeTab === "Clientes" ? " tab-active" : "")}
										onClick={() => {
											setActiveTab("Clientes");
											setContent(<ClientList />);
											setShowMenu(false);
										}}>
										<i className="fas fa-user-friends" />
										<span>Clientes</span>
									</button>
								</li>
								<li>
									<button
										className={"admin-tab" + (activeTab === "Estadísticas" ? " tab-active" : "")}
										onClick={() => {
											setActiveTab("Estadísticas");
											setContent(
												// Aquí iría un <Componente/> con el contenido que queramos mostrar en cada caso
												<div className="dashboard-content-wrapper">
													<h1 className="dashboard-content-title">Estadísticas</h1>
												</div>
											);
											setShowMenu(false);
										}}>
										<i className="far fa-chart-bar" />
										<span>Estadísticas</span>
									</button>
								</li>
								<li>
									<button
										className={"admin-tab" + (activeTab === "Productos" ? " tab-active" : "")}
										onClick={() => {
											setActiveTab("Productos");
											setContent(<AdminProducts />);
											setShowMenu(false);
										}}>
										<i className="fas fa-cog" />
										<span>Servicios</span>
									</button>
								</li>
								<li>
									<button
										className={"admin-tab" + (activeTab === "Negocio" ? " tab-active" : "")}
										onClick={() => {
											setActiveTab("Negocio");
											setContent(
												<div className="dashboard-content-wrapper admin-products">
													<h1 className="dashboard-content-title">
														Configuración del negocio
													</h1>
													<BusinessSettings />
												</div>
											);
											setShowMenu(false);
										}}>
										<i className="fas fa-store-alt" />
										<span>Negocio</span>
									</button>
								</li>
								<li>
									<button
										className={"admin-tab" + (activeTab === "Perfil" ? " tab-active" : "")}
										onClick={() => {
											setActiveTab("Perfil");
											setContent(<AccountSettings />);
											setShowMenu(false);
										}}>
										<i className="fas fa-user" />
										<span>Perfil</span>
									</button>
								</li>
							</ul>
							<div className="admin-logout">
								<Link
									className="btn-cool"
									to="/"
									onClick={() => (document.querySelector("html").style.position = "initial")}>
									Home
								</Link>
								<button className="logout btn-cool" onClick={() => actions.logout()}>
									<span>Salir</span>
									<i className="fas fa-sign-out-alt" />
								</button>
							</div>
						</nav>
					</div>
				</aside>
				<section className="dashboard-content admin-content">{content}</section>
			</div>
		</main>
	);
};
