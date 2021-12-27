import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

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

	useEffect(() => {
		actions.getClients();
	}, []);

	useEffect(
		() => {
			if (store.clients)
				setList(
					store.clients.map((client, idx) => (
						<li className="li-client" key={idx}>
							{client.name}
						</li>
					))
				);
		},
		[store.clients]
	);

	const handleSearchOnChange = e => {
		setSrchInput(e.target.value);
	};

	const handleSearchSubmit = e => {
		e.preventDefault();
		console.log(srchInput);
		setSrchInput("");
	};

	return store.clients ? (
		<div className="dashboard-content-wrapper admin-products">
			<div className="clients-wrapper">
				<aside className="clients-list">
					<h1 className="dashboard-content-title">Clientes</h1>
					<ul>
						<li className="search-client">
							<form onSubmit={handleSearchSubmit} className="search-wrapper">
								<i className="fas fa-search" />
								<input
									type="search"
									className="search-input search-client-input"
									placeholder="Buscar cliente..."
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
							</form>
						</li>
						{list}
					</ul>
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
