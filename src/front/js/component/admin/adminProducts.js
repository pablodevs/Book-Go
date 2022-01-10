import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

export const AdminProducts = () => {
	const { actions, store } = useContext(Context);

	const [minutes, setMinutes] = useState([]);
	const [hours, setHours] = useState([]);
	const [dispoChecked, setDispoChecked] = useState(true);
	const [productList, setProductList] = useState([]);
	const [data, setData] = useState({
		id: "",
		product: "DEFAULT", // con 'name' no funciona bien
		price: "",
		description: "",
		duration: ""
		// IMPORTANTE: AÑADIR DURACIÓN DEL SERVICIO!
	});

	useEffect(
		() => {
			setProductList(store.products.map(element => element.name));
			if (Object.keys(store.new_product).length && store.new_product.id)
				setData({
					id: store.new_product.id,
					product: store.new_product.name, // esto de que se llamen diferente no me convence
					price: store.new_product.price,
					description: store.new_product.description,
					duration: store.new_product.duration
				});
			else
				setData({
					id: "",
					product: "DEFAULT", // con 'name' no funciona bien
					price: "",
					description: "",
					duration: ""
				});
		},
		[store.products, store.new_product]
	);

	useEffect(() => {
		let listOfMinutes = [];
		let listOfHours = [];

		for (let i = 0; i < 60; i += 5) {
			listOfMinutes.push(i);
		}
		for (let i = 0; i <= 24; i += 1) {
			listOfHours.push(i);
		}

		setMinutes(listOfMinutes);
		setHours(listOfHours);

		// for (n of list.map(n => `${n}min`)) {
		// 	console.log(parseInt(n), typeof parseInt(n))
		// }
	}, []);

	const submitFirstForm = event => {
		event.preventDefault();
		if (data.id && productList.includes(data.product))
			actions.setToast(
				"promise",
				{ loading: "Guardando...", success: `${data.product} guardado` },
				actions.updateProduct(data),
				"toast-confirm"
			);
	};
	const submitSecondForm = event => {
		event.preventDefault();
		// actions.updateDispo(data);
	};

	const handleInputChange = e => {
		if (e.target.name === "product" && productList.includes(e.target.value)) {
			let prod = store.products.find(prod => prod.name === e.target.value); // ⚠️ Si 2 tienen el mismo nombre esto falla
			setData({
				id: prod.id,
				product: prod.name, // esto de que se llamen diferente no me convence
				price: prod.price,
				description: prod.description,
				duration: prod.duration
			});
			// actions.resetNewProduct();
		} else
			setData({
				...data,
				[e.target.name]: e.target.value
			});
	};

	return (
		<div className="dashboard-content-wrapper admin-products">
			<h1 className="dashboard-content-title">Servicios</h1>
			<div className="admin-sections-wrapper">
				<section className="dashboard-first-section">
					<form onSubmit={submitFirstForm} className="dashboard-form">
						<div className="admin-form-group services-subtitle">
							<h2 className="dashboard-content-subtitle">Información del servicio</h2>
							<div className="admin-icon-btn-group">
								<button
									type="button"
									className="admin-icon-btn icon-btn"
									data-tooltip="añadir producto"
									onClick={() => actions.setPopup("add-product", "Añadir producto")}>
									<i className="fas fa-plus" />
								</button>
								{/* ⚠️ OJITO: si añadimos o eliminamos un prod, se tiene que actualizar el hook productList */}
								<button
									type="button"
									className={"admin-icon-btn icon-btn danger" + (data.id ? "" : " inactive")}
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
							<div className="admin-form-subgroup">
								Duración
								<label htmlFor="hours" className="dashboard-label">
									Hora(s)
								</label>
								<div className="select-wrapper">
									<select
										// onChange={e => handleInputChange(e)}
										id="hours"
										name="hours"
										value={Math.floor(data.duration / 60)}>
										{hours.map((hour, idx) => (
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
										// onChange={e => handleInputChange(e)}
										id="minutes"
										name="minutes"
										value={data.duration % 60}>
										{minutes.map((min, idx) => (
											<option key={idx} value={min}>
												{`${min}min`}
											</option>
										))}
									</select>
								</div>
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
									value={data.description}
									onChange={e => handleInputChange(e)}
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
				<section className="dashboard-second-section">
					<form className="dashboard-form" onSubmit={submitSecondForm}>
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
							<div className="admin-form-subgroup availability-checkbox">
								<input
									type="checkbox"
									id="available"
									name="available"
									value="available"
									defaultChecked={dispoChecked}
									onChange={() => setDispoChecked(!dispoChecked)}
								/>
								<label className="dashboard-label" htmlFor="available">
									Disponible
								</label>
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
