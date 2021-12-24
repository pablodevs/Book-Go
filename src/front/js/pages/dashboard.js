import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Redirect } from "react-router-dom";
import { AccountSettings } from "../component/dashboard/accountSettings";
import { ReservationsHistory } from "../component/dashboard/reservationsHistory";
import home from "../../img/dashboard/home_transparent.png";
import "../../styles/pages/dashboard.scss";

export const Dashboard = () => {
	const { actions, store } = useContext(Context);
	const [content, setContent] = useState(null);
	const [activeTab, setActiveTab] = useState("");

	useEffect(() => {
		store.user.name
			? setContent(
					<div className="center dashboard-welcome">
						<h2>¡Hola {store.user.name.charAt(0).toUpperCase() + store.user.name.slice(1)}!</h2>
						<img src={home} width="100" height="100" />
					</div>
			  )
			: null;
	}, []);

	const pretyPhone = phone =>
		phone.slice(0, 3) + " " + phone.slice(3, 5) + " " + phone.slice(5, 7) + " " + phone.slice(7, 9);

	return !store.user.token ? (
		<Redirect to="/" />
	) : (
		<div className="dashboard-wrapper">
			<aside className="dashboard-aside">
				<div className="dashboard-user-info">
					<div className="dashboard-img-wrapper">
						{store.user.img_url ? (
							<img className="dashboard-img" src={store.user.img_url} />
						) : (
							<div className="avatar dashboard-avatar">
								<svg viewBox="0 0 24 24" className="avatar__img">
									<path
										d="M12,3.5c2.347,0,4.25,1.903,4.25,4.25S14.347,12,12,12s-4.25-1.903-4.25-4.25S9.653,3.5,12,3.5z
                                M5,20.5
                                c0-3.866,3.134-7,7-7s7,3.134,7,7H5z"
									/>
								</svg>
							</div>
						)}
						<button type="button" className="edit-img dashboard-edit-img" onClick={() => undefined}>
							<i className="fas fa-camera" />
						</button>
					</div>
					<div className="dashboard-info">
						<h1 className="dashboard-username">
							{store.user.name.charAt(0).toUpperCase() +
								store.user.name.slice(1) +
								" " +
								store.user.lastname.charAt(0).toUpperCase() +
								store.user.lastname.slice(1)}
						</h1>
						<p>{pretyPhone(store.user.phone)}</p>
					</div>
				</div>
				<nav>
					<ul>
						<li className="dashboard-li">
							<button
								className={"dashboard-tab" + (activeTab === "Reservas" ? " tab-active" : "")}
								onClick={() => {
									setActiveTab("Reservas");
									setContent(<ReservationsHistory />);
								}}>
								<i className="far fa-calendar-alt" />
								<span>Reservas</span>
							</button>
						</li>
						<li className="dashboard-li">
							<button
								className={"dashboard-tab" + (activeTab === "Cuenta" ? " tab-active" : "")}
								onClick={() => {
									setActiveTab("Cuenta");
									setContent(
										<div className="dashboard-content-wrapper">
											<h1 className="dashboard-content-title">Cuenta y Configuración</h1>
											<AccountSettings />
										</div>
									);
								}}>
								<i className="fas fa-cog" />
								<span>Cuenta y Configuración</span>
							</button>
						</li>
						<li className="dashboard-li">
							<button className="logout dashboard-tab" onClick={() => actions.logout()}>
								Salir
							</button>
						</li>
					</ul>
				</nav>
			</aside>
			<section className="dashboard-content">{content}</section>
		</div>
	);
};
