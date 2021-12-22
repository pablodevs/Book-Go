import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

export const AdminProducts = () => {
	const { actions, store } = useContext(Context);

	const [dispoChecked, setDispoChecked] = useState(true);
	const [productList, setProductList] = useState([]);
	const [data, setData] = useState({
		id: null,
		product: "", // con 'name' no funciona bien
		price: "",
		description: ""
	});

	useEffect(() => {
		setProductList(store.products.map(element => element.name));
	}, []);

	const submitFirstForm = event => {
		event.preventDefault();
		if (data.product !== "" && productList.includes(data.product)) actions.updateProduct(data);
	};
	const submitSecondForm = event => {
		event.preventDefault();
		// actions.updateDispo(data);
	};

	const handleInputChange = e => {
		if (e.target.name === "product" && productList.includes(e.target.value)) {
			let prod = store.products.find(prod => prod.name === e.target.value);
			setData({
				id: prod.id,
				product: prod.name, // esto de que se llamen diferente no me convence
				price: prod.price,
				description: prod.description
			});
		} else
			setData({
				...data,
				[e.target.name]: e.target.value
			});
	};

	return (
		<div className="dashboard-content-wrapper admin-products">
			<h1 className="dashboard-content-title">Productos y Disponibilidad</h1>
			<div className="admin-sections-wrapper">
				<section className="products-info">
					<form onSubmit={submitFirstForm} className="dashboard-forms">
						<h2 className="dashboard-content-subtitle">Información del producto</h2>
						<div className="admin-form-group">
							<div className="admin-form-subgroup">
								<label className="dashboard-label" htmlFor="product">
									Producto
								</label>
								<div className="dashboard-input product-input">
									<select onChange={e => handleInputChange(e)} id="product" name="product">
										<option hidden selected disabled value="">
											Elige un producto...
										</option>
										{productList.map((prod, idx) => (
											<option key={idx} value={prod}>
												{prod}
											</option>
										))}
									</select>
									<button
										type="button"
										className="edit-input"
										// On click: abrir un cuadro de dialogo pequeño para cambiar el nombre del producto
										onClick={() => {
											return data.product !== ""
												? actions.setPopup("edit-product", `Editar ${data.product}`)
												: "";
										}}>
										<i className="far fa-edit" />
									</button>
								</div>
							</div>
							<div className="admin-form-subgroup">
								<label htmlFor="new-product" className="dashboard-label">
									Nuevo producto
								</label>
								<button type="button" id="new-product" className="input-button">
									{/* ⚠️ OJITO: si añadimos uno nuevo, se tiene que actualizar el hook productList */}
									<span>Añadir</span>
									<i className="fas fa-plus" />
								</button>
							</div>
							<div className="admin-form-subgroup">
								<label htmlFor="del-product" className="dashboard-label">
									Eliminar producto
								</label>
								<button type="button" id="del-product" className="input-button">
									<span>Elminiar</span>
									<i className="fas fa-trash-alt" />
								</button>
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
									<small className="img-placeholder">imagen</small>
									<img
										src={
											data.product !== ""
												? require(`../../../img/${data.product.toLowerCase()}.jpg`)
												: ""
										}
										onError={e => e.target.classList.add("border-darkblue")}
										onLoad={e => e.target.classList.remove("border-darkblue")}
										className="admin-product-img"
									/>
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
				<section className="disponibility">
					<form className="dashboard-forms" onSubmit={submitSecondForm}>
						<div className="disponibility-title admin-form-group">
							<h2 className="dashboard-content-subtitle">Disponibilidad:</h2>
							<span className={productList.includes(data.product) ? "text-confirm" : "text-cancel"}>
								{data.product || "Ningún producto seleccionado"}
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
