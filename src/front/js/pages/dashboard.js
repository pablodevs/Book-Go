import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Redirect } from "react-router-dom";
import { AccountSettings } from "../component/dashboard/accountSettings";
import { ReservationsHistory } from "../component/dashboard/reservationsHistory";
import default_user from "../../img/dashboard/default_user.png";
import home from "../../img/dashboard/home_transparent.png";
import "../../styles/pages/dashboard.scss";

export const Dashboard = () => {
	const { actions, store } = useContext(Context);
	let [content, setContent] = useState(null);

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
						<img className="dashboard-img" src={store.user.img_url || default_user} />
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
							<button className="dashboard-tab" onClick={() => setContent(<ReservationsHistory />)}>
								Reservas
							</button>
						</li>
						<li className="dashboard-li">
							<button className="dashboard-tab" onClick={() => setContent(<AccountSettings />)}>
								Cuenta y Configuración
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
