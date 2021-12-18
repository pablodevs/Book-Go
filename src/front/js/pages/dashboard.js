import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Redirect } from "react-router-dom";
import default_user from "../../img/profile/default_user.png";
import home from "../../img/profile/home_transparent.png";
import "../../styles/pages/dashboard.scss";
import { DashboardAccount } from "../component/dashboard/dashboardAccount";
import { ReservationsHistory } from "../component/dashboard/reservationsHistory";

export const Dashboard = () => {
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

	const pretyPhone = phone =>
		phone.slice(0, 3) + " " + phone.slice(3, 5) + " " + phone.slice(5, 7) + " " + phone.slice(7, 9);

	return !store.user.token ? (
		<Redirect to="/" />
	) : (
		<div className="profile-wrapper">
			<aside className="profile-aside">
				<div className="profile-user-info">
					<div className="profile-img-wrapper">
						<img className="profile-img" src={store.user.img_url || default_user} />
					</div>
					<div className="profile-info">
						<h1 className="profile-username">
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
						<li>
							<button onClick={() => setContent(<ReservationsHistory />)}>Reservas</button>
						</li>
						<li>
							<button onClick={() => setContent(<DashboardAccount />)}>Cuenta y Configuración</button>
						</li>
						<li>
							<button className="logout" onClick={() => actions.logout()}>
								Salir
							</button>
						</li>
					</ul>
				</nav>
			</aside>
			<div className="profile-content">{content}</div>
		</div>
	);
};
