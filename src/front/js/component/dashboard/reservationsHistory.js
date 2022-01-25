import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { BookingCard } from "./bookingcard";
import booking_img from "../../../img/dashboard/calendario.png";

export const ReservationsHistory = () => {
	const { actions, store } = useContext(Context);

	const [error, setError] = useState(null);
	const [content, setContent] = useState(
		<div className="spinner-border text-info mx-auto mt-5" role="status">
			<span className="visually-hidden">Loading...</span>
		</div>
	);
	const [bookings, setBookings] = useState(null);
	const [nextBookings, setNextBookings] = useState([]);
	const [prevBookings, setPrevBookings] = useState([]);
	const [collapse, setCollapse] = useState({
		first_collapse: false,
		second_collapse: false
	});

	useEffect(
		() => {
			if (!store.popup)
				// Obtenemos todas las reservas
				fetch(`${process.env.BACKEND_URL}/user/bookings`, {
					headers: {
						Authorization: "Bearer " + localStorage.getItem("token")
					}
				})
					.then(response => {
						if (!response.ok) throw Error(response);
						return response.json();
					})
					.then(resp => {
						setBookings(resp);
					})
					.catch(err => setError(err.message));
		},
		[store.popup]
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
			else if (bookings && bookings.length !== 0) {
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
							<BookingCard
								key={idx}
								bookID={book.id}
								date={date}
								service={service}
								status={book.status}
							/>
						);
					else
						prevBookingsList.push(
							<BookingCard
								key={idx}
								bookID={book.id}
								date={date}
								service={service}
								status={book.status}
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

	useEffect(
		() => {
			if (nextBookings.length !== 0) {
				let toggleElement = document.querySelector("#nextBookings");
				setCollapse({
					...collapse,
					[toggleElement.getAttribute("data-name")]: true
				});
				toggleElement.nextElementSibling.style.maxHeight =
					toggleElement.nextElementSibling.scrollHeight + 150 + "px";
			}
		},
		[nextBookings]
	);

	useEffect(
		() => {
			if (error) setContent(error);
		},
		[error]
	);

	const handleCollapse = e => {
		setCollapse({
			...collapse,
			[e.target.getAttribute("data-name")]: !collapse[e.target.getAttribute("data-name")]
		});

		if (!collapse[e.target.getAttribute("data-name")])
			e.target.nextElementSibling.style.maxHeight = e.target.nextElementSibling.scrollHeight + "px";
		else e.target.nextElementSibling.style.maxHeight = "0";
	};

	return (
		<>
			{content ? (
				content
			) : (
				<div className="dashboard-content-wrapper">
					<h1 className="dashboard-content-title">Reservas</h1>
					{nextBookings.length !== 0 ? (
						<div className="collapse-wrapper border-0 overflow-visible">
							<h2
								className="dashboard-content-subtitle collapse-toggle shadow-none"
								onClick={handleCollapse}
								data-name="first_collapse"
								aria-expanded={collapse.first_collapse}
								id="nextBookings">
								Próximas reservas
							</h2>
							<div className="collapse-content">{nextBookings}</div>
						</div>
					) : (
						""
					)}
					{prevBookings.length !== 0 ? (
						<div className="collapse-wrapper border-0 overflow-visible">
							<h2
								className="dashboard-content-subtitle collapse-toggle shadow-none"
								onClick={handleCollapse}
								data-name="second_collapse"
								aria-expanded={collapse.second_collapse}>
								Reservas pasadas
							</h2>
							<div className="collapse-content">{prevBookings}</div>
						</div>
					) : (
						""
					)}
				</div>
			)}
		</>
	);
};
