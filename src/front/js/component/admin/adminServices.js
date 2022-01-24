import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../store/appContext";

export const AdminServices = () => {
	const { actions, store } = useContext(Context);

	const [collapse, setCollapse] = useState({
		first_collapse: false,
		second_collapse: false
	});

	const [minutesList, setMinutesList] = useState([]);
	const [hoursList, setHoursList] = useState([]);
	const [minutes, setMinutes] = useState(0);
	const [hours, setHours] = useState(0);
	const [schedule, setSchedule] = useState(false);
	const [serviceList, setServiceList] = useState([]);
	const [data, setData] = useState({
		id: "",
		service: "DEFAULT", // con 'name' no funciona bien
		price: "",
		description: "",
		duration: "",
		is_active: false,
		sku: "",
		service_img_url: "",
		public_id: ""
	});
	useEffect(() => {
		let listOfMinutes = [];
		let listOfHours = [];

		for (let i = 0; i < 60; i += 5) {
			listOfMinutes.push(i);
		}
		for (let i = 0; i <= 24; i += 1) {
			listOfHours.push(i);
		}

		setMinutesList(listOfMinutes);
		setHoursList(listOfHours);

		// Actualizamos la información de los servicios
		actions.get_services();
		actions.resetNewService();

		// Actualizamos la información del negocio
		actions.getBusinessInfo();
	}, []);

	useEffect(
		() => {
			setServiceList(store.services.map(element => element.name));
			if (Object.keys(store.new_service).length && store.new_service.id) {
				setHours(Math.floor(store.new_service.duration / 60));
				setMinutes(store.new_service.duration % 60);
				setData({
					id: store.new_service.id,
					service: store.new_service.name, // esto de que se llamen diferente no me convence
					price: store.new_service.price,
					description: store.new_service.description,
					duration: store.new_service.duration,
					is_active: store.new_service.is_active,
					sku: store.new_service.sku,
					service_img_url: store.new_service.service_img_url,
					public_id: store.new_service.public_id
				});
			} else {
				setHours(Math.floor(0));
				setMinutes(0);
				setData({
					id: "",
					service: "DEFAULT", // con 'name: "DEFAULT"' no funciona bien
					price: "",
					description: "",
					duration: "",
					is_active: false,
					sku: "",
					service_img_url: "",
					public_id: ""
				});
			}
		},
		[store.services, store.new_service]
	);

	useEffect(
		() => {
			// Comprobamos si existe un horario
			if (
				store.business.schedule &&
				store.business.weekdays &&
				store.business.schedule !== "00:00,00:00" &&
				store.business.schedule.split(",")[0] !== store.business.schedule.split(",")[1] &&
				store.business.weekdays[0] !== "" &&
				data.sku &&
				data.sku !== "" &&
				data.duration !== 0
			)
				setSchedule(true);
			else setSchedule(false);
		},
		[data.sku, store.business, data]
	);

	useEffect(
		() =>
			setData({
				...data,
				duration: hours * 60 + minutes
			}),
		[hours, minutes]
	);

	const handleInputChange = e => {
		if (e.target.name === "service" && serviceList.includes(e.target.value)) {
			let service = store.services.find(service => service.name === e.target.value); // ⚠️ Si 2 tienen el mismo nombre esto falla
			setHours(Math.floor(service.duration / 60));
			setMinutes(service.duration % 60);
			setData({
				id: service.id,
				service: service.name, // esto de que se llamen diferente no me convence
				price: service.price,
				description: service.description,
				duration: service.duration,
				is_active: service.is_active,
				sku: service.sku,
				service_img_url: service.service_img_url,
				public_id: service.public_id
			});
		} else
			setData({
				...data,
				[e.target.name]: e.target.value
			});
	};

	const handleSubmitForm = event => {
		event.preventDefault();
		if (data.id && serviceList.includes(data.service))
			actions.setToast(
				"promise",
				{ loading: "Guardando...", success: `${data.service} guardado` },
				actions.updateService(data),
				"toast-success"
			);
	};

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
		<div className="dashboard-content-wrapper admin-services">
			<h1 className="dashboard-content-title">Servicios</h1>
			<div className="admin-sections-wrapper">
				<section className="admin-first-section">
					<form onSubmit={handleSubmitForm} className="dashboard-form">
						<div className="admin-form-group services-subtitle">
							<h2 className="dashboard-content-subtitle">Información del servicio</h2>
							<div className="admin-icon-btn-group">
								<button
									type="button"
									className="icon-btn"
									data-tooltip="añadir servicio"
									onClick={() => actions.setPopup("add-service", "Información del servicio")}>
									<i className="fas fa-plus" />
								</button>
								{/* ⚠️ OJITO: si añadimos o eliminamos un servicio, se tiene que actualizar el hook serviceList */}
								<button
									type="button"
									className={"icon-btn danger" + (data.id ? "" : " inactive")}
									data-tooltip="eliminar servicio"
									onClick={() => {
										if (!data.id) return;
										const deleteFunct = () => actions.removeService(data.id);
										actions.setPopup("confirm", "Eliminar el servicio", undefined, deleteFunct);
									}}>
									<i className="fas fa-trash-alt" />
								</button>
							</div>
						</div>
						<small>
							Modifica los servicios aquí. Recuerda crear un horario{" "}
							<Link to="/admin/business">aquí</Link> para gestionar las horas disponibles.
						</small>
						<div className="admin-form-group">
							<div className="admin-form-subgroup">
								<label className="dashboard-label" htmlFor="service">
									Servicio
								</label>
								<div className="dashboard-input service-input">
									<div className="select-wrapper">
										<select
											onChange={handleInputChange}
											id="service"
											name="service"
											value={data.service}>
											<option value="DEFAULT" disabled hidden>
												Elige un servicio...
											</option>
											{serviceList.map((service, idx) => (
												<option key={idx} value={service}>
													{service}
												</option>
											))}
										</select>
									</div>
									<button
										type="button"
										className={"icon-btn" + (data.id ? "" : " inactive")}
										data-tooltip="cambiar nombre"
										// On click: abrir un cuadro de dialogo pequeño para cambiar el nombre del servicio
										onClick={() => {
											return data.id
												? actions.setPopup("edit-service-name", `Editar ${data.service}`)
												: "";
										}}>
										<i className="fas fa-pen" />
									</button>
								</div>
							</div>
						</div>
						<div className="admin-form-group">
							<div className="collapse-wrapper">
								<h3
									className="collapse-toggle"
									onClick={handleCollapse}
									data-name="first_collapse"
									aria-expanded={collapse.first_collapse}>
									Precio y duración del servicio
								</h3>
								<div className="admin-form-subgroup duration-subgroup collapse-content">
									<div className="dflex-row">
										<div>
											<label className="dashboard-label" htmlFor="price">
												Precio
											</label>
											<div className="price-input">
												<input
													type="number"
													id="price"
													name="price"
													min="0"
													onChange={handleInputChange}
													value={data.price}
												/>
												<span>€</span>
											</div>
										</div>
										<div>
											<label htmlFor="hours" className="dashboard-label">
												Hora(s)
											</label>
											<div className="select-wrapper">
												<select
													onChange={e => setHours(parseInt(e.target.value))}
													id="hours"
													value={hours}>
													{hoursList.map((hour, idx) => (
														<option key={idx} value={hour}>
															{`${hour}h`}
														</option>
													))}
												</select>
											</div>
											<label htmlFor="minutes" className="dashboard-label">
												Minutos
											</label>
											<div className="select-wrapper">
												<select
													onChange={e => setMinutes(parseInt(e.target.value))}
													id="minutes"
													value={minutes}>
													{minutesList.map((min, idx) => (
														<option key={idx} value={min}>
															{`${min}min`}
														</option>
													))}
												</select>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="admin-form-group">
							<div className="collapse-wrapper">
								<h3
									className="collapse-toggle"
									onClick={handleCollapse}
									data-name="second_collapse"
									aria-expanded={collapse.second_collapse}>
									Descripción e imagen del servicio
								</h3>
								<div className="collapse-content">
									<div className="admin-form-subgroup">
										<label htmlFor="description" className="dashboard-label">
											Descripción
											<span>{data.description.length}</span>
										</label>
										<textarea
											id="description"
											name="description"
											rows="3"
											maxLength="1000"
											value={data.description}
											onChange={handleInputChange}
										/>
									</div>
									<div className="admin-form-subgroup img-subgroup">
										<div className="admin-service-img-wrapper">
											<small className="img-placeholder">
												<i className="fas fa-camera" />
											</small>
											{data.service_img_url ? (
												<img
													src={data.service_img_url}
													onLoad={e => e.target.classList.add("border-none")}
													className="admin-service-img"
												/>
											) : (
												""
											)}
											{data.id ? (
												<button
													type="button"
													className="edit-img"
													// On click: abrir un cuadro de dialogo pequeño para cambiar el nombre del servicio
													onClick={() =>
														actions.setPopup("edit-img", "Cambiar foto", {
															...data,
															preset: "services_images"
														})
													}>
													<i className="fas fa-camera" />
												</button>
											) : (
												""
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
						<div>
							<button type="submit" className="btn-cool">
								Guardar cambios
							</button>
						</div>
					</form>
				</section>
				<section className="admin-second-section">
					<form onSubmit={handleSubmitForm} className="dashboard-form">
						<div
							className="center flex-row flex-wrap justify-content-between align-items-baseline"
							style={{ gap: "1rem" }}>
							<h2 className="dashboard-content-subtitle me-auto">Activar servicio</h2>
							<span className={data.id ? "text-confirm" : "text-cancel"}>
								{data.id ? data.service : "Ningún servicio seleccionado"}
							</span>
						</div>
						<span>
							Es necesario agregar un <i>código de artículo</i> que permitirá a tus clientes pagar online.
						</span>
						<div className="admin-form-group">
							<div className="admin-form-subgroup">
								<label className="dashboard-label" htmlFor="sku">
									Sku (código de artículo)
								</label>
								<div className="dashboard-input">
									<input
										id="sku"
										type="text"
										name="sku"
										maxLength="150"
										value={data.sku}
										autoComplete="off"
										onChange={handleInputChange}
									/>
									<button
										type="button"
										className="clear-input"
										onClick={() => {
											setData({
												...data,
												sku: ""
											});
										}}>
										<i className="fas fa-times" />
									</button>
								</div>
							</div>
						</div>
						<span>Activar esta opción permitirá a tus clientes reservar el servicio.</span>
						<div className="admin-form-group">
							<div className="admin-form-subgroup">
								<div className="form-check form-switch">
									<label
										className="form-check-label"
										htmlFor="is_active"
										data-tooltip={
											schedule
												? "Permite que se pueda reservar este servicio"
												: "Primero define un horario y un sku"
										}>
										<input
											className="form-check-input"
											type="checkbox"
											role="switch"
											id="is_active"
											disabled={!schedule}
											checked={data.is_active}
											onChange={() =>
												setData({
													...data,
													is_active: !data.is_active
												})
											}
										/>
										Activar servicio
									</label>
								</div>
							</div>
						</div>
						<div>
							<button type="submit" className="btn-cool">
								Guardar cambios
							</button>
						</div>
					</form>
				</section>
			</div>
		</div>
	);
};
