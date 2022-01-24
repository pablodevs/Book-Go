import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { Context } from "../store/appContext";
import { Reservations } from "../component/admin/reservations";
import { ClientsList } from "../component/admin/clientsList";
import { AdminServices } from "../component/admin/adminServices";
import { BusinessSettings } from "../component/admin/businessSettings";
import { AccountSettings } from "../component/dashboard/accountSettings";
import gears from "../../img/dashboard/gears.png";
import "../../styles/pages/adminPanel.scss";

export const AdminPanel = () => {
	const { actions, store } = useContext(Context);

	const params = useParams();
	let history = useHistory();

	const [content, setContent] = useState(null);
	const [activeTab, setActiveTab] = useState("");
	const [showMenu, setShowMenu] = useState(false);

	const showWelcome = () => {
		setContent(
			<div className="center dashboard-welcome">
				{/* <span>¡Hola {store.user.name.charAt(0).toUpperCase() + store.user.name.slice(1)}!</span> */}
				<span>Panel administrativo</span>
				<img src={gears} height="100" />
			</div>
		);
	};

	useEffect(
		() => {
			let userToken = store.token || localStorage.getItem("token");
			if (userToken) actions.getProfileData(userToken);
			else history.push("/");
		},
		[store.token]
	);

	const url = window.location.pathname.split("/").pop();
	useEffect(
		() => {
			if (params.content) {
				setActiveTab(params.content);
				if (params.content === "welcome") showWelcome();
				else if (params.content === "bookings") setContent(<Reservations />);
				else if (params.content === "clients") setContent(<ClientsList />);
				else if (params.content === "statistics")
					setContent(
						// Aquí iría un <Componente/> con el contenido que queramos mostrar en cada caso
						<div className="dashboard-content-wrapper">
							<h1 className="dashboard-content-title">Estadísticas</h1>
						</div>
					);
				else if (params.content === "services") setContent(<AdminServices />);
				else if (params.content === "business") setContent(<BusinessSettings />);
				else if (params.content === "profile") setContent(<AccountSettings />);
				setShowMenu(false);
			}
		},
		[url]
	);

	useEffect(
		() => {
			if (showMenu) {
				document.querySelector("html").style.position = "fixed";
				document.querySelector("html").style.overflowY = "scroll";
			} else {
				document.querySelector("html").style.position = "initial";
			}
		},
		[showMenu]
	);

	return (
		<main className="admin-panel-wrapper">
			{store.token && store.user.is_admin ? (
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
									{/* <li>
										<button
											className={"admin-tab" + (activeTab === "bookings" ? " tab-active" : "")}
											onClick={() => {
												setActiveTab("bookings");
												history.push("/admin/bookings");
												setShowMenu(false);
											}}>
											<i className="far fa-calendar-alt" />
											<span>Reservas</span>
										</button>
									</li> */}
									<li>
										<button
											className={"admin-tab" + (activeTab === "clients" ? " tab-active" : "")}
											onClick={() => {
												setActiveTab("clients");
												history.push("/admin/clients");
												setShowMenu(false);
											}}>
											<i className="fas fa-user-friends" />
											<span>Clientes</span>
										</button>
									</li>
									<li>
										<button
											className={"admin-tab" + (activeTab === "statistics" ? " tab-active" : "")}
											onClick={() => {
												setActiveTab("statistics");
												history.push("/admin/statistics");
												setShowMenu(false);
											}}>
											<i className="far fa-chart-bar" />
											<span>Estadísticas</span>
										</button>
									</li>
									<li>
										<button
											className={"admin-tab" + (activeTab === "services" ? " tab-active" : "")}
											onClick={() => {
												setActiveTab("services");
												history.push("/admin/services");
												setShowMenu(false);
											}}>
											<i className="fas fa-cog" />
											<span>Servicios</span>
										</button>
									</li>
									<li>
										<button
											className={"admin-tab" + (activeTab === "business" ? " tab-active" : "")}
											onClick={() => {
												setActiveTab("business");
												history.push("/admin/business");
												setShowMenu(false);
											}}>
											<i className="fas fa-store-alt" />
											<span>Negocio</span>
										</button>
									</li>
									<li>
										<button
											className={"admin-tab" + (activeTab === "profile" ? " tab-active" : "")}
											onClick={() => {
												setActiveTab("profile");
												history.push("/admin/profile");
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
			) : null}
		</main>
	);
};
