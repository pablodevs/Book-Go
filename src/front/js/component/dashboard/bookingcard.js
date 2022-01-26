import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import PropTypes from "prop-types";

export const BookingCard = props => {
	const { actions, store } = useContext(Context);

	return (
		<div className="bookingcard-wrapper">
			<div className="bookingcard-content">
				<h1 className="bookingcard-title">{props.service.name}</h1>
				<div>
					Fecha:{" "}
					<span className="bookingcard-date">
						{props.date.toLocaleDateString(undefined, {
							year: "numeric",
							month: "2-digit",
							day: "2-digit"
						})}{" "}
					</span>
				</div>
				<div>
					Hora:{" "}
					<span className="bookingcard-date">
						{props.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
					</span>
				</div>
				<div>
					Estado:{" "}
					{props.status === "Confirmed" ? (
						<span className="bookingcard-confirmed">
							Confirmada <i className="far fa-check-circle" />
						</span>
					) : (
						<span className="bookingcard-canceled">
							Cancelada <i className="fas fa-ban" />
						</span>
					)}
				</div>
				<div className="bookingcard-buttons">
					<button
						className="btn-cool book-again-btn mx-auto"
						onClick={() => {
							actions.updateBooking("service", props.service);
							actions.setPopup("calendar", `${props.service.name}: ¿Cuándo?`, props.service.name);
						}}>
						Reservar de nuevo
					</button>
					{props.status === "Confirmed" ? (
						<button
							className="btn-skip"
							onClick={() => {
								const deleteFunct = () => actions.cancelBooking(props.bookID);
								actions.setPopup(
									"confirm",
									"Cancelar cita",
									{
										button: "Cancelar",
										toast: {
											success: "Cita cancelada",
											loading: "Cancelando..."
										},
										message: "Esta acción no podrá deshacerse."
									},
									deleteFunct
								);
							}}>
							Cancelar <i className="fas fa-trash-alt" />
						</button>
					) : (
						""
					)}
				</div>
			</div>
			<div className="bookingcard-img-wrapper">
				<img src={props.service.service_img_url} className="bookingcard-img" alt="imagen del servicio" />
			</div>
		</div>
	);
};

BookingCard.propTypes = {
	date: PropTypes.object,
	service: PropTypes.object,
	status: PropTypes.string,
	bookID: PropTypes.number
};
