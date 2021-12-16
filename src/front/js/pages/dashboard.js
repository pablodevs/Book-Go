import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Redirect } from "react-router-dom";
import default_user from "../../img/profile/default_user.png";
import "../../styles/pages/dashboard.scss";

export const Dashboard = () => {
	const { actions, store } = useContext(Context);

	useEffect(() => {}, []);

	return !store.user.token ? (
		<Redirect to="/" />
	) : (
		<div className="profile-wrapper">
			<aside className="profile-aside">
				<div className="profile-user-info center">
					<img className="profile-img" src={store.user.img_url || default_user} width="65" height="65" />
					<div className="profile-info">
						<h1 className="profile-username">
							{store.user.name.charAt(0).toUpperCase() +
								store.user.name.slice(1) +
								" " +
								store.user.lastname.charAt(0).toUpperCase() +
								store.user.lastname.slice(1)}
						</h1>
						<p>695 565 910</p>
					</div>
				</div>
				<nav>
					<ul>
						<li>
							<button>Citas</button>
						</li>
						<li>
							<button>Cuenta</button>
						</li>
						<li>
							<button className="logout" onClick={() => actions.logout()}>
								Salir
							</button>
						</li>
					</ul>
				</nav>
			</aside>
			<div className="profile-content center">Content</div>
		</div>
	);
};
