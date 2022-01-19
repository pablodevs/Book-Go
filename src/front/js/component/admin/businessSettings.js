import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../store/appContext";
import { ButtonDay } from "./buttonDay";
import dates from "../../dates.json";

export const BusinessSettings = () => {
	const { actions, store } = useContext(Context);

	const [weekDays, setWeekDays] = useState([]);
	const [timeFrom, setTimeFrom] = useState("");
	const [timeTo, setTimeTo] = useState("");
	const [firstData, setFirstData] = useState({
		schedule: "",
		weekdays: []
	});
	const [secondData, setSecondData] = useState({
		address: "",
		phone: "",
		fb_url: "",
		ig_url: "",
		twitter_url: ""
	});

	useEffect(() => {
		// Renderizamos los días de la semana <ButtonDay />
		let weekDaysArray = dates["day_text"]
			.slice(1, dates["day_text"].length)
			.concat(dates["day_text"].slice(0, 1))
			.map((dayname, idx) => <ButtonDay weekday={dayname} key={idx} />);

		setWeekDays(weekDaysArray);

		// Actualizamos la información del negocio
		actions.getBusinessInfo();
	}, []);

	useEffect(
		() => {
			if (store.business.id) {
				setSecondData({
					address: store.business.address,
					phone: store.business.phone,
					fb_url: store.business.fb_url,
					ig_url: store.business.ig_url,
					twitter_url: store.business.twitter_url
				});
				if (store.business.schedule) {
					// viene en formato string: "10:00,20:00"
					setTimeFrom(store.business.schedule.split(",")[0]);
					setTimeTo(store.business.schedule.split(",")[1]);
				}
			}
		},
		[store.business]
	);

	useEffect(
		() => {
			if (store.business.weekdays)
				setFirstData({
					...firstData,
					weekdays: store.business.weekdays.join()
				});
		},
		[store.business.weekdays]
	);

	useEffect(
		() => {
			if (timeFrom && timeTo)
				setFirstData({
					...firstData,
					schedule: `${timeFrom},${timeTo}`
				});
		},
		[timeFrom, timeTo]
	);

	const handleInputChange = e => {
		setSecondData({
			...secondData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmitFirstForm = event => {
		event.preventDefault();
		if (timeFrom && timeTo) {
			actions.setToast(
				"promise",
				{ loading: "Guardando...", success: `Cambios guardados` },
				actions.updateBusinessInfo(firstData),
				"toast-confirm"
			);
		}
	};

	const handleSubmitSecondForm = event => {
		event.preventDefault();
		actions.setToast(
			"promise",
			{ loading: "Guardando...", success: `Cambios guardados` },
			actions.updateBusinessInfo(secondData),
			"toast-confirm"
		);
	};

	return (
		// PODER CAMBIAR LA FOTO DE PORTADA (NO HABRÁ CAROUSEL)
		<div className="dashboard-content-wrapper">
			<h1 className="dashboard-content-title">Configuración del negocio</h1>
			<div className="admin-sections-wrapper">
				<section className="admin-first-section">
					<form onSubmit={handleSubmitFirstForm} className="dashboard-form">
						<h2 className="dashboard-content-subtitle">Horario</h2>
						<small>
							Cambia el horario de apertura de tu negocio. Una vez creado el horario, ya podrás activar
							tus servicios <Link to="/admin/services">aquí.</Link>
						</small>
						<div className="admin-form-group">
							<div className="admin-form-subgroup">
								<div className="admin-weekdays">{weekDays}</div>
								<div className="admin-weekdays-buttons">
									<button
										type="button"
										className="icon-btn"
										onClick={() => actions.setActiveWeekDay("all")}>
										Todos los días
									</button>
									<button
										type="button"
										className="icon-btn"
										onClick={() => actions.setActiveWeekDay("L-V")}>
										L ➜ V
									</button>
									<button
										type="button"
										className="icon-btn"
										onClick={() => actions.setActiveWeekDay("0")}>
										Ninguno
									</button>
								</div>
							</div>
						</div>
						<div className="admin-form-group">
							<div className="admin-form-subgroup">
								<label className="dashboard-label" htmlFor="time-from">
									Desde
								</label>
								<input
									type="time"
									id="time-from"
									value={timeFrom}
									onChange={e => setTimeFrom(e.target.value)}
								/>
							</div>
							<div className="admin-form-subgroup">
								<label className="dashboard-label" htmlFor="time-to">
									Hasta
								</label>
								<input
									type="time"
									id="time-to"
									value={timeTo}
									onChange={e => setTimeTo(e.target.value)}
								/>
							</div>
						</div>
						<div>
							<button type="submit" className="save-button">
								Guardar cambios
							</button>
						</div>
					</form>
				</section>
				<section className="admin-second-section">
					<form onSubmit={handleSubmitSecondForm} className="dashboard-form">
						<h2 className="dashboard-content-subtitle">Detalles del negocio</h2>
						<small>
							Cambia la información del negocio aquí. Esta información afectará al pié de la página.
						</small>
						<div>
							<label className="dashboard-label" htmlFor="address">
								Dirección
							</label>
							<div className="dashboard-input">
								<input
									onChange={handleInputChange}
									type="text"
									id="address"
									name="address"
									value={secondData.address}
									placeholder="C/..."
								/>
								<button
									type="button"
									className="clear-input"
									onClick={() => {
										setSecondData({
											...secondData,
											address: ""
										});
									}}>
									<i className="fas fa-times" />
								</button>
							</div>
						</div>
						<div>
							<label className="dashboard-label" htmlFor="businessPhone">
								Teléfono del establecimiento
							</label>
							<div className="dashboard-input">
								<input
									onChange={handleInputChange}
									type="tel"
									id="businessPhone"
									name="phone"
									value={secondData.phone}
									placeholder="teléfono de contacto..."
								/>
								<button
									type="button"
									className="clear-input"
									onClick={() => {
										setSecondData({
											...secondData,
											phone: ""
										});
									}}>
									<i className="fas fa-times" />
								</button>
							</div>
						</div>
						<h2 className="dashboard-content-subtitle">Redes sociales</h2>
						<div className="socialMedia-input">
							<label className="dashboard-label" htmlFor="facebook">
								<i className="fab fa-facebook-square" />
							</label>
							<div className="dashboard-input">
								<input
									onChange={handleInputChange}
									type="text"
									id="facebook"
									name="fb_url"
									value={secondData.fb_url}
									placeholder="https://facebook.com/"
								/>
								<button
									type="button"
									className="clear-input"
									onClick={() => {
										setSecondData({
											...secondData,
											fb_url: ""
										});
									}}>
									<i className="fas fa-times" />
								</button>
							</div>
						</div>
						<div className="socialMedia-input">
							<label className="dashboard-label" htmlFor="instagram">
								<i className="fab fa-instagram" />
							</label>
							<div className="dashboard-input">
								<input
									onChange={handleInputChange}
									type="text"
									id="instagram"
									name="ig_url"
									value={secondData.ig_url}
									placeholder="https://instagram.com/"
								/>
								<button
									type="button"
									className="clear-input"
									onClick={() =>
										setSecondData({
											...secondData,
											ig_url: ""
										})
									}>
									<i className="fas fa-times" />
								</button>
							</div>
						</div>
						<div className="socialMedia-input">
							<label className="dashboard-label" htmlFor="twitter">
								<i className="fab fa-twitter" />
							</label>
							<div className="dashboard-input">
								<input
									onChange={handleInputChange}
									type="mail"
									id="twitter"
									name="twitter_url"
									value={secondData.twitter_url}
									placeholder="https://twitter.com/"
								/>
								<button
									type="button"
									className="clear-input"
									onClick={() =>
										setSecondData({
											...secondData,
											twitter_url: ""
										})
									}>
									<i className="fas fa-times" />
								</button>
							</div>
						</div>
						<div>
							<button type="submit" className="save-button">
								Guardar cambios
							</button>
						</div>
					</form>
				</section>
			</div>
		</div>
	);
};
