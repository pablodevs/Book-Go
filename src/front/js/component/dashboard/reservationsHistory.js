import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { BookingCard } from "./bookingcard";

export const ReservationsHistory = () => {
	const { actions, store } = useContext(Context);

	const [collapse, setCollapse] = useState({
		first_collapse: false,
		second_collapse: false
	});

	useEffect(() => {
		// Fetch de las reservas
	}, []);

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
		<div className="dashboard-content-wrapper">
			<h1 className="dashboard-content-title">Reservas</h1>
			<div className="collapse-wrapper border-0 overflow-visible">
				<h2
					className="dashboard-content-subtitle collapse-toggle shadow-none"
					onClick={handleCollapse}
					data-name="first_collapse"
					aria-expanded={collapse.first_collapse}>
					Próximas reservas
				</h2>
				<div className="collapse-content">
					<BookingCard />
					<BookingCard />
				</div>
			</div>
			<div className="collapse-wrapper border-0 overflow-visible">
				<h2
					className="dashboard-content-subtitle collapse-toggle shadow-none"
					onClick={handleCollapse}
					data-name="second_collapse"
					aria-expanded={collapse.second_collapse}>
					Reservas pasadas
				</h2>
				<div className="collapse-content">
					<BookingCard />
				</div>
			</div>
		</div>
	);
};
