import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { ClientTab } from "./clientTab";
import { PretyPhone } from "../../pages/dashboard.js";
import { BookingLi } from "./bookingLi";
import booking_img from "../../../img/dashboard/calendario.png";

export const ClientsList = () => {
	const { actions, store } = useContext(Context);
	const [list, setList] = useState([]);
	const [srchInput, setSrchInput] = useState("");
	const [client, setClient] = useState({});
	const [content, setContent] = useState(
		<div className="spinner-border text-info mx-auto mt-5" role="status">
			<span className="visually-hidden">Loading...</span>
		</div>
	);
	const [activePill, setActivePill] = useState(0);
	const [bookings, setBookings] = useState(null);
	const [nextBookings, setNextBookings] = useState([]);
	const [prevBookings, setPrevBookings] = useState([]);

	const handleSearchOnChange = e => {
		setSrchInput(e.target.value);
	};

	const getClientInfo = newClient => {
		setClient(newClient);
	};

	useEffect(
		() => {
			if (client.id) {
				setActivePill(0);
				// Obtenemos todas las reservas
				fetch(`${process.env.BACKEND_URL}/user/${client.id}/bookings`, {
					headers: {
						Authorization: "Bearer " + store.token
					}
				})
					.then(response => {
						if (!response.ok) throw Error(response);
						return response.json();
					})
					.then(resp => {
						setBookings(resp);
					})
					.catch(err => console.error(err.message));
			} else actions.setActiveClientTab(null);
			actions.getClients();
		},
		[client]
	);

	useEffect(
		() => {
			if (bookings && bookings.length === 0)
				setContent(
					<div className="center dashboard-welcome">
						<span style={{ fontWeight: "normal" }}>No hay reservas de momento</span>
						<img src={booking_img} width="100" height="100" style={{ filter: "opacity(40%)" }} />
					</div>
				);
			else if (client.id && bookings && bookings.length !== 0) {
				let nextBookingsList = [];
				let prevBookingsList = [];

				let bookingsList = bookings.sort((a, b) => {
					const formatInput = input => {
						let dateString = `${input.date.split("/")[2]}/${input.date.split("/")[1]}/${
							input.date.split("/")[0]
						} ${input.time}`;
						return new Date(dateString).getTime();
					};

					let dateA = formatInput(a);
					let dateB = formatInput(b);

					if (a.status === "Confirmed" && b.status === "Confirmed") return dateA - dateB;
					else if (a.status !== "Confirmed" && b.status === "Confirmed") return 1;
					else if (a.status === "Confirmed" && b.status !== "Confirmed") return -1;
				});

				bookingsList.map((book, idx) => {
					let service = store.services.find(service => service.id === book.service_id);
					// Cambiamos de día/mes/año a año/mes/día para que lo coja new Date()
					let dateString = `${book.date.split("/")[2]}/${book.date.split("/")[1]}/${
						book.date.split("/")[0]
					} ${book.time}`;
					let date = new Date(dateString);

					// Compruebo si es una fecha posterior o la reserva es del pasado
					if (date.getTime() > new Date().getTime())
						nextBookingsList.push(
							<BookingLi key={idx} bookID={book.id} date={date} service={service} status={book.status} />
						);
					else
						prevBookingsList.push(
							<BookingLi key={idx} bookID={book.id} date={date} service={service} status={book.status} />
						);
				});
				setContent(null);
				setNextBookings(nextBookingsList);
				setPrevBookings(prevBookingsList);
			}
		},
		[bookings]
	);

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
		<div className="dashboard-content-wrapper">
			<div className="clients-wrapper">
				<aside className="clients-list">
					<h1 className="dashboard-content-title clients-list-title">Clientes</h1>
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
				{Object.keys(client).length && store.clients.map(element => element.id).includes(client.id) ? (
					<div className="client-details">
						<div className="client-details-info">
							<div className="client-details-header">
								<button
									type="button"
									className="icon-btn danger"
									data-tooltip-bot="eliminar usuario"
									onClick={() => {
										const deleteFunct = () => actions.deleteUser(client.id);
										actions.setPopup(
											"confirm",
											`Eliminar ${client.name}`,
											{
												button: "Eliminar",
												toast: {
													success: "Eliminado",
													loading: "Eliminando..."
												},
												message:
													"Esta acción no podrá deshacerse y se eliminarán las reservas asociadas al usuario."
											},
											deleteFunct
										);
									}}>
									<i className="fas fa-trash-alt" />
								</button>
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
									<button
										type="button"
										className="edit-img dashboard-edit-img"
										data-tooltip-left="Cambiar imagen de perfil"
										onClick={() => undefined}>
										<i className="fas fa-camera" />
									</button>
								</div>
								<button
									type="button"
									className="icon-btn danger"
									data-tooltip-bot="Nueva cita"
									onClick={() => {
										return;
										// if (!data.id) return;
										// const deleteFunct = () => actions.removeService(data.id);
										// actions.setPopup(
										// 	"confirm",
										// 	`Eliminar ${data.service}`,
										// 	{
										// 		button: "Eliminar",
										// 		toast: {
										// 			success: "Eliminado",
										// 			loading: "Eliminando..."
										// 		},
										// 		message:
										// 			"Esta acción no podrá deshacerse y se eliminarán las reservas actuales del servicio."
										// 	},
										// 	deleteFunct
										// );
									}}>
									<i className="far fa-calendar-alt" />
								</button>
							</div>
							<div className="client-details-name">
								{client.name} {client.lastname}
							</div>
							<div className="client-details-group">
								<div className="client-details-subgroup">
									<i className="fas fa-phone-alt" />
									<span>{PretyPhone(client.phone)}</span>
								</div>
								<div className="client-details-subgroup">
									<i className="fas fa-envelope" />
									<span>{client.email}</span>
								</div>
							</div>
						</div>
						{content ? (
							content
						) : (
							<div className="client-bookings-wrapper">
								<div className="pills-wrapper">
									<div
										className="pills-pseudoelement"
										style={activePill ? { transform: "translateX(100%)" } : {}}
									/>
									<button
										onClick={() => setActivePill(0)}
										className={"pills" + (activePill ? "" : " active")}>
										Próximas reservas <span>({nextBookings.length})</span>
									</button>
									<button
										onClick={() => setActivePill(1)}
										className={"pills" + (activePill ? " active" : "")}>
										Reservas pasadas <span>({prevBookings.length})</span>
									</button>
								</div>
								<div className="client-bookings">{activePill ? prevBookings : nextBookings}</div>
							</div>
						)}
					</div>
				) : (
					""
				)}
			</div>
		</div>
	) : null;
};
