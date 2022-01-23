import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useHistory, useParams } from "react-router-dom";
import { AccountSettings } from "../component/dashboard/accountSettings";
import { ReservationsHistory } from "../component/dashboard/reservationsHistory";
import { CloudinaryUploadWidget } from "../component/cloudinary/cloudinaryUploadWidget";
import house from "../../img/dashboard/home_transparent.png";
import "../../styles/pages/dashboard.scss";

export function PretyPhone(phone) {
	return phone.slice(0, 3) + " " + phone.slice(3, 5) + " " + phone.slice(5, 7) + " " + phone.slice(7, 9);
}

export const Dashboard = () => {
	const { actions, store } = useContext(Context);
	const [content, setContent] = useState(null);
	const [activeTab, setActiveTab] = useState("");

	const params = useParams();
	let history = useHistory();

	useEffect(
		() => {
			if (store.cloudinaryInfo.image_url && store.cloudinaryInfo.public_id) {
				let body = new FormData();
				body.append("profile_image_url", store.cloudinaryInfo.image_url);
				body.append("public_id", store.cloudinaryInfo.public_id);

				actions.setToast(
					"promise",
					{ loading: "Guardando...", success: "Imagen modificada" },
					actions.updateUser(body),
					"toast-success"
				);
			}
		},
		[store.cloudinaryInfo]
	);

	const showWelcome = () => {
		setContent(
			<div className="center dashboard-welcome">
				{/* <h2>¡Hola {store.user.name.charAt(0).toUpperCase() + store.user.name.slice(1)}!</h2> */}
				<span>¡Hola de nuevo!</span>
				<img src={house} width="100" height="100" />
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
				else if (params.content === "bookings") setContent(<ReservationsHistory />);
				else if (params.content === "profile") setContent(<AccountSettings />);
			}
		},
		[url]
	);

	return (
		<div className="dashboard-wrapper">
			{store.token && store.user.name ? (
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
							<CloudinaryUploadWidget
								preset="client_images"
								defaultComp={
									<button
										type="button"
										className="edit-img dashboard-edit-img"
										onClick={() => actions.setWidget(true)}>
										<i className="fas fa-camera" />
									</button>
								}
								successComp={
									<button
										type="button"
										className="edit-img dashboard-edit-img"
										onClick={() => actions.setWidget(true)}>
										<i className="fas fa-camera" />
									</button>
								}
							/>
						</div>
						<div className="dashboard-info">
							<h1 className="dashboard-username">
								{store.user.name.charAt(0).toUpperCase() +
									store.user.name.slice(1) +
									" " +
									store.user.lastname.charAt(0).toUpperCase() +
									store.user.lastname.slice(1)}
							</h1>
							<p>{PretyPhone(store.user.phone)}</p>
						</div>
					</div>
					<nav>
						<ul>
							<li className="dashboard-li">
								<button
									className={"dashboard-tab" + (activeTab === "bookings" ? " tab-active" : "")}
									onClick={() => {
										setActiveTab("bookings");
										history.push("/dashboard/bookings");
									}}>
									<i className="far fa-calendar-alt" />
									<span>Reservas</span>
								</button>
							</li>
							<li className="dashboard-li">
								<button
									className={"dashboard-tab" + (activeTab === "profile" ? " tab-active" : "")}
									onClick={() => {
										setActiveTab("profile");
										history.push("/dashboard/profile");
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
			) : null}
			<section className="dashboard-content">{content}</section>
		</div>
	);
};
