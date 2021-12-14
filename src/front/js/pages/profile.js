import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/pages/profile.scss";

export const Profile = () => {
	const { actions, store } = useContext(Context);

	useEffect(() => {}, []);

	return (
		<div className="view">
			<div className="profile-wrapper">
				<aside className="profile-aside">
					<div className="profile-user-info center">
						<div className="profile-img center">
							<img src={store.img_url} alt="foto_perfil" width="50" height="50" />
						</div>
						<div className="profile-info">
							<h1 className="profile-username">Pablo Álamo</h1>
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
								<button>Cerrar Sesión</button>
							</li>
						</ul>
					</nav>
				</aside>
				<div className="profile-content center">Content</div>
			</div>
		</div>
	);
};
