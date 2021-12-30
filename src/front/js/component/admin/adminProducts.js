import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Context } from "../../store/appContext";

export const AdminProducts = () => {
	const { actions, store } = useContext(Context);

	const [dispoChecked, setDispoChecked] = useState(true);
	const [productList, setProductList] = useState([]);
	const [data, setData] = useState({
		id: null,
		product: "DEFAULT", // con 'name' no funciona bien
		price: "",
		description: ""
	});

	useEffect(
		() => {
			setProductList(store.products.map(element => element.name));
			if (Object.keys(store.new_product).length && store.new_product.id)
				setData({
					id: store.new_product.id,
					product: store.new_product.name, // esto de que se llamen diferente no me convence
					price: store.new_product.price,
					description: store.new_product.description
				});
			else
				setData({
					id: null,
					product: "DEFAULT", // con 'name' no funciona bien
					price: "",
					description: ""
				});
		},
		[store.products, store.new_product]
	);

	const submitFirstForm = event => {
		event.preventDefault();
		if (data.id && productList.includes(data.product)) {
			toast.promise(actions.updateProduct(data), {
				loading: "Guardando...",
				success: "Guardado correctamente",
				error: () => `Error: ${store.message}`
			});
		}
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
				description: prod.description
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
								<label htmlFor="description" className="dashboard-label">
									Descripción
								</label>
								<textarea
									id="description"
									name="description"
									rows="3"
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
