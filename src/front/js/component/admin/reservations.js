import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { BookingLi } from "./bookingLi";
import booking_img from "../../../img/dashboard/calendario.png";

export const Reservations = () => {
	const { actions, store } = useContext(Context);
	const [content, setContent] = useState(
		<div className="spinner-border text-info mx-auto mt-5" role="status">
			<span className="visually-hidden">Loading...</span>
		</div>
	);
	const [activePill, setActivePill] = useState(0);
	const [bookings, setBookings] = useState(null);
	const [nextBookings, setNextBookings] = useState([]);
	const [prevBookings, setPrevBookings] = useState([]);

	useEffect(() => {
		actions.getAllBookings();
	}, []);

	useEffect(
		() => {
			if (store.allClientBookings && store.allClientBookings.length > 0) setBookings(store.allClientBookings);
		},
		[store.allClientBookings]
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
			else if (bookings && bookings.length > 0) {
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
							<BookingLi
								key={idx}
								bookID={book.id}
								date={date}
								service={service}
								status={book.status}
								client={book.client}
								extended={true}
							/>
						);
					else
						prevBookingsList.push(
							<BookingLi
								key={idx}
								bookID={book.id}
								date={date}
								service={service}
								status={book.status}
								client={book.client}
								extended={true}
							/>
						);
				});
				setContent(null);
				setNextBookings(nextBookingsList);
				setPrevBookings(prevBookingsList);
			}
		},
		[bookings]
	);

	return (
		<div className="dashboard-content-wrapper">
			<h1 className="dashboard-content-title">Reservas</h1>
			<div className="clients-wrapper">
				<div className="client-details admin-bookings">
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
			</div>
		</div>
	);
};
