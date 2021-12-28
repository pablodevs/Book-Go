import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { ClientTab } from "./clientTab";

export const ClientList = () => {
	const { actions, store } = useContext(Context);
	const [list, setList] = useState([]);
	const [srchInput, setSrchInput] = useState("");
	const [client, setClient] = useState({
		name: "Name",
		lastname: "Lastname",
		email: "email@example.com",
		phone: "654 65 46 54",
		profile_image_url: "https://res.cloudinary.com/dxmbcy20g/image/upload/v1640399168/j3lqxalgevo7rdmortz3.png"
	});

	const handleSearchOnChange = e => {
		setSrchInput(e.target.value);
	};

	const handleSearchSubmit = e => {
		e.preventDefault();
	};

	const getClientInfo = newClient => {
		setClient({
			name: newClient.name,
			lastname: newClient.lastname,
			email: newClient.email,
			phone: newClient.phone,
			profile_image_url: newClient.profile_image_url
		});
	};

	useEffect(() => {
		actions.getClients();
	}, []);

	useEffect(
		() => {
			let clientsList = [];
			if (store.clients) {
				clientsList = store.clients.filter(
					client =>
						(client.name + " " + client.lastname).toLowerCase().includes(srchInput.toLowerCase()) ||
						client.id == srchInput
				);
				clientsList = clientsList.map((client, idx) => (
					<ClientTab client={client} key={idx + 1} sendClientInfo={getClientInfo} />
				));
			}
			clientsList.length
				? setList(clientsList)
				: setList([
						<li style={{ textAlign: "center", paddingRight: "1rem" }} key={0}>
							Sin resultados
						</li>
				  ]);
		},
		[store.clients, srchInput]
	);

	return store.clients ? (
		<div className="dashboard-content-wrapper admin-products">
			<div className="clients-wrapper">
				<aside className="clients-list">
					<h1 className="dashboard-content-title">Clientes</h1>
					<div className="search-client search-wrapper">
						<i className="fas fa-search" />
						<input
							type="search"
							className="search-input search-client-input"
							placeholder="Buscar cliente o ID"
							onChange={handleSearchOnChange}
							value={srchInput}
						/>
						{srchInput !== "" ? (
							<button type="button" className="search-clear" onClick={() => setSrchInput("")}>
								<i className="fas fa-times" />
							</button>
						) : (
							""
						)}
					</div>
					<ul>{list}</ul>
				</aside>
				<div className="client-details">
					<div className="dashboard-img-wrapper">
						{client.profile_image_url ? (
							<img className="dashboard-img" src={client.profile_image_url} />
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
					<div className="client-details-name">
						{client.name} {client.lastname}
					</div>
				</div>
			</div>
		</div>
	) : null;
};
