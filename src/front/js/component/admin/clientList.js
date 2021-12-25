import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

export const ClientList = () => {
	const { actions, store } = useContext(Context);

	useEffect(() => {
		actions.getClients();
	}, []);

	return store.clients ? (
		<div className="dashboard-content-wrapper admin-products">
			<h1 className="dashboard-content-title">Lista de clientes</h1>
			<ul>
				{store.clients.map((client, idx) => (
					<li key={idx}>{client.name}</li>
				))}
			</ul>
		</div>
	) : null;
};
