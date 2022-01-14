import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { ButtonDay } from "./buttonDay";
import dates from "../../dates.json";

export const BusinessSettings = () => {
	const { actions, store } = useContext(Context);

	const [weekDays, setWeekDays] = useState([]);
	const [data, setData] = useState({
		address: "",
		businessPhone: ""
	});
	const [socialMedia, setSocialMedia] = useState({
		facebook: store.socialMedia.facebook,
		instagram: store.socialMedia.instagram,
		twitter: store.socialMedia.twitter
	});
	const [timeFrom, setTimeFrom] = useState("");
	const [timeTo, setTimeTo] = useState("");

	useEffect(() => {
		let weekDaysArray = dates["day_text"]
			.slice(1, dates["day_text"].length)
			.concat(dates["day_text"].slice(0, 1))
			.map((dayname, idx) => <ButtonDay weekday={dayname} key={idx} />);

		setWeekDays(weekDaysArray);
	}, []);

	const handleInputChange = e => {
		setData({
			...data,
			[e.target.name]: e.target.value
		});
	};
	const handleSocMedChange = e => {
		setSocialMedia({
			...socialMedia,
			[e.target.name]: e.target.value
		});
	};

	const submitFirstForm = event => {
		event.preventDefault();
		let socialMediaAux = {
			facebook: socialMedia.facebook,
			instagram: socialMedia.instagram,
			twitter: socialMedia.twitter
		};
		// TODAVÍA NO EXISTE EN LA BASE DE DATOS
		actions.updateSocialMedia(socialMediaAux);
		// actions.updateBusinessInfo(data);
	};
	const submitSecondForm = event => {
		event.preventDefault();
		if (timeFrom && timeTo && store.activeWeekDays.length !== 0)
			console.log(store.activeWeekDays.join(), timeFrom, timeTo);
		actions.updateBusinessInfo({
			schedule: store.activeWeekDays.join()
		});
	};

	return (
		// PODER CAMBIAR LA FOTO DE PORTADA (NO HABRÁ CAROUSEL)
		<div className="dashboard-content-wrapper">
			<h1 className="dashboard-content-title">Configuración del negocio</h1>
			<div className="admin-sections-wrapper">
				<section className="admin-first-section">
					<form onSubmit={submitFirstForm} className="dashboard-form">
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
									onChange={e => {
										handleInputChange(e);
									}}
									type="text"
									id="address"
									name="address"
									value={data.address}
									placeholder="C/..."
								/>
								<button
									type="button"
									className="clear-input"
									onClick={() => {
										setData({
											...data,
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
									onChange={e => {
										handleInputChange(e);
									}}
									type="tel"
									id="businessPhone"
									name="businessPhone"
									value={data.businessPhone}
									placeholder="teléfono de contacto..."
								/>
								<button
									type="button"
									className="clear-input"
									onClick={() => {
										setData({
											...data,
											businessPhone: ""
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
									onChange={e => {
										handleSocMedChange(e);
									}}
									type="text"
									id="facebook"
									name="facebook"
									value={socialMedia.facebook}
									placeholder="https://facebook.com/"
								/>
								<button
									type="button"
									className="clear-input"
									onClick={() => {
										setSocialMedia({
											...socialMedia,
											facebook: ""
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
									onChange={e => {
										handleSocMedChange(e);
									}}
									type="text"
									id="instagram"
									name="instagram"
									value={socialMedia.instagram}
									placeholder="https://instagram.com/"
								/>
								<button
									type="button"
									className="clear-input"
									onClick={() =>
										setSocialMedia({
											...socialMedia,
											instagram: ""
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
									onChange={e => {
										handleSocMedChange(e);
									}}
									type="mail"
									id="twitter"
									name="twitter"
									value={socialMedia.twitter}
									placeholder="https://twitter.com/"
								/>
								<button
									type="button"
									className="clear-input"
									onClick={() =>
										setSocialMedia({
											...socialMedia,
											twitter: ""
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
				<section className="admin-second-section">
					<form onSubmit={submitSecondForm} className="dashboard-form">
						<h2 className="dashboard-content-subtitle">Horario</h2>
						<small>Cambia el horario de apertura aquí.</small>
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
			</div>
		</div>
	);
};
