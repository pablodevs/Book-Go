import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../store/appContext";

export const AdminServices = () => {
	const { actions, store } = useContext(Context);

	const [minutesList, setMinutesList] = useState([]);
	const [hoursList, setHoursList] = useState([]);
	const [minutes, setMinutes] = useState(0);
	const [hours, setHours] = useState(0);
	const [productList, setProductList] = useState([]);
	const [data, setData] = useState({
		id: "",
		product: "DEFAULT", // con 'name' no funciona bien
		price: "",
		description: "",
		duration: "",
		is_active: false
		// product_img_url: "",
		// sku: ""
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

		// Actualizamos la información de los productos
		actions.get_products();
	}, []);

	useEffect(
		() => {
			setProductList(store.products.map(element => element.name));
			if (Object.keys(store.new_product).length && store.new_product.id) {
				setHours(Math.floor(store.new_product.duration / 60));
				setMinutes(store.new_product.duration % 60);
				setData({
					id: store.new_product.id,
					product: store.new_product.name, // esto de que se llamen diferente no me convence
					price: store.new_product.price,
					description: store.new_product.description,
					duration: store.new_product.duration,
					is_active: store.new_product.is_active
				});
			} else {
				setHours(Math.floor(0));
				setMinutes(0);
				setData({
					id: "",
					product: "DEFAULT", // con 'name: "DEFAULT"' no funciona bien
					price: "",
					description: "",
					duration: "",
					is_active: false
				});
			}
		},
		[store.products, store.new_product]
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
		if (e.target.name === "product" && productList.includes(e.target.value)) {
			let prod = store.products.find(prod => prod.name === e.target.value); // ⚠️ Si 2 tienen el mismo nombre esto falla
			setHours(Math.floor(prod.duration / 60));
			setMinutes(prod.duration % 60);
			setData({
				id: prod.id,
				product: prod.name, // esto de que se llamen diferente no me convence
				price: prod.price,
				description: prod.description,
				duration: prod.duration,
				is_active: prod.is_active
			});
		} else
			setData({
				...data,
				[e.target.name]: e.target.value
			});
	};

	const handleSubmitFirstForm = event => {
		event.preventDefault();
		if (data.id && productList.includes(data.product))
			actions.setToast(
				"promise",
				{ loading: "Guardando...", success: `${data.product} guardado` },
				actions.updateProduct(data),
				"toast-confirm"
			);
	};
	const handleSubmitSecondForm = event => {
		event.preventDefault();
		// actions.updateDispo(data);
	};

	return (
		<div className="dashboard-content-wrapper admin-services">
			<h1 className="dashboard-content-title">Servicios</h1>
			<div className="admin-sections-wrapper">
				<section className="admin-first-section">
					<form onSubmit={handleSubmitFirstForm} className="dashboard-form">
						<div className="admin-form-group services-subtitle">
							<h2 className="dashboard-content-subtitle">Información del servicio</h2>
							<div className="admin-icon-btn-group">
								<button
									type="button"
									className="icon-btn"
									data-tooltip="añadir producto"
									onClick={() => actions.setPopup("add-product", "Añadir producto")}>
									<i className="fas fa-plus" />
								</button>
								{/* ⚠️ OJITO: si añadimos o eliminamos un prod, se tiene que actualizar el hook productList */}
								<button
									type="button"
									className={"icon-btn danger" + (data.id ? "" : " inactive")}
									data-tooltip="eliminar producto"
									onClick={() => {
										if (!data.id) return;
										const deleteFunct = () => actions.removeProduct(data.id);
										actions.setPopup("confirm", "Eliminar el producto", undefined, deleteFunct);
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
								<label className="dashboard-label" htmlFor="product">
									Producto
								</label>
								<div className="dashboard-input product-input">
									<div className="select-wrapper">
										<select
											onChange={e => handleInputChange(e)}
											id="product"
											name="product"
											value={data.product}>
											<option value="DEFAULT" disabled hidden>
												Elige un producto...
											</option>
											{productList.map((prod, idx) => (
												<option key={idx} value={prod}>
													{prod}
												</option>
											))}
										</select>
									</div>
									<button
										type="button"
										className={"icon-btn" + (data.id ? "" : " inactive")}
										data-tooltip="cambiar nombre"
										// On click: abrir un cuadro de dialogo pequeño para cambiar el nombre del producto
										onClick={() => {
											return data.id
												? actions.setPopup("edit-product", `Editar ${data.product}`)
												: "";
										}}>
										<i className="fas fa-pen" />
									</button>
								</div>
							</div>
						</div>
						<div className="admin-form-group">
							<div className="admin-form-subgroup price-subgroup">
								<label
									className="availability-checkbox dashboard-label"
									htmlFor="is_active"
									data-tooltip="Permitir que se pueda reservar este servicio">
									<input
										type="checkbox"
										id="is_active"
										checked={data.is_active}
										onChange={() =>
											setData({
												...data,
												is_active: !data.is_active
											})
										}
									/>
									Activo
								</label>
								<label className="dashboard-label" htmlFor="price">
									Precio
								</label>
								<div className="price-input">
									<input
										type="number"
										id="price"
										name="price"
										min="0"
										onChange={e => handleInputChange(e)}
										value={data.price}
									/>
									<span>€</span>
								</div>
							</div>
							<div className="admin-form-subgroup duration-subgroup">
								<span className="admin-form-subgroup-title">Duración:</span>
								<div className="dflex-row">
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
									</div>
									<div>
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
						<div className="admin-form-group">
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
									onChange={e => handleInputChange(e)}
								/>
							</div>
							<div className="admin-form-subgroup img-subgroup">
								<div className="admin-product-img-wrapper">
									<small className="img-placeholder">
										<i className="fas fa-camera" />
									</small>
									{data.id ? (
										<img
											src={require(`../../../img/${data.product.toLowerCase()}.jpg`)}
											onLoad={e => e.target.classList.add("border-none")}
											className="admin-product-img"
										/>
									) : (
										""
									)}
									<button
										type="button"
										className={"edit-img" + (data.id ? "" : " inactive")}
										// On click: abrir un cuadro de dialogo pequeño para cambiar el nombre del producto
										onClick={() => {
											return;
											// return data.id
											// 	? actions.setPopup("edit-product", `Editar ${data.product}`)
											// 	: "";
										}}>
										<i className="fas fa-camera" />
									</button>
								</div>
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
					<form className="dashboard-form" onSubmit={handleSubmitSecondForm}>
						<div className="disponibility-title admin-form-group">
							<h2 className="dashboard-content-subtitle">Disponibilidad:</h2>
							<span className={productList.includes(data.product) ? "text-confirm" : "text-cancel"}>
								{data.product === "DEFAULT" ? "Ningún producto seleccionado" : data.product}
							</span>
						</div>
						<div className="admin-form-group">
							<div className="admin-form-subgroup">
								<label className="dashboard-label" htmlFor="date">
									Fecha
								</label>
								<input type="date" id="date" name="date" />
							</div>
							<div className="admin-form-subgroup">
								<label className="dashboard-label" htmlFor="time">
									Hora
								</label>
								<input type="time" id="time" name="time" />
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
