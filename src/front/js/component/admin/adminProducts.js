import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

export const AdminProducts = () => {
	const { actions, store } = useContext(Context);

	const [dispoChecked, setDispoChecked] = useState(true);
	const [productList, setProductList] = useState([]);
	const [data, setData] = useState({
		product: "", // con 'name' no funciona bien
		price: "",
		description: ""
	});

	useEffect(() => {
		setProductList(store.products.map(element => element.name));
	}, []);

	const submitForm = event => {
		event.preventDefault();
		// actions.updateProduct(data);
	};

	const handleInputChange = e => {
		if (e.target.name === "product" && productList.includes(e.target.value)) {
			let prod = store.products.find(prod => prod.name === e.target.value);
			setData({
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
					<form onSubmit={submitForm} className="dashboard-forms">
						<h2 className="dashboard-content-subtitle">Información del producto</h2>
						<div className="admin-form-group">
							<div className="admin-form-subgroup">
								<label className="dashboard-label" htmlFor="product">
									Producto
								</label>
								<div className="dashboard-input">
									<input
										onBlur={e => {
											if (!productList.includes(e.target.value) && e.target.value)
												e.target.classList.add("input-error");
											else e.target.classList.remove("input-error");
										}}
										onFocus={e => e.target.classList.remove("input-error")}
										onChange={e => handleInputChange(e)}
										type="text"
										id="product"
										name="product" // ⚠️ no puede ser name porque google lo identifica como el Nombre de una persona, habrá que cambiar la database
										value={data.product}
										placeholder="Elige un producto"
										list="products-list"
										autoComplete="off"
										autoFocus
									/>
									{/* Habrá que hacer un get products y un map de la resp para cargar esto: */}
									<datalist id="products-list">
										{productList.map((prod, idx) => (
											<option key={idx} value={prod} />
										))}
									</datalist>
									<button
										type="button"
										className="clear-input"
										style={{ right: "2.5rem" }}
										onClick={() => {
											document.querySelector("#product").classList.remove("input-error");
											setData({
												product: "",
												price: "",
												description: ""
											});
										}}>
										<i className="fas fa-times" />
									</button>
								</div>
							</div>
							<div className="admin-form-subgroup">
								<label htmlFor="new-product" className="dashboard-label">
									Nuevo producto
								</label>
								<button type="button" id="new-product" className="input-button">
									{/* ⚠️ OJITO: si añadimos uno nuevo, se tiene que actualizar el hook productList */}
									{/* Además hay que programar el botón de eliminar producto: <i className="fas fa-trash-alt"></i> */}
									<span>Añadir</span>
									<i className="fas fa-plus" />
								</button>
							</div>
							<div className="admin-form-subgroup">
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
						</div>
						<div className="admin-form-group">
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
						</div>
						<div>
							<button type="submit" className="save-button">
								Guardar cambios
							</button>
						</div>
					</form>
				</section>
				<section className="disponibility">
					<form className="dashboard-forms" onSubmit={submitForm}>
						<div className="disponibility-title admin-form-group">
							<h2 className="dashboard-content-subtitle">Disponibilidad:</h2>
							<span className={productList.includes(data.product) ? "text-confirm" : "text-cancel"}>
								{productList.includes(data.product) ? data.product : "Ningún producto seleccionado"}
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
