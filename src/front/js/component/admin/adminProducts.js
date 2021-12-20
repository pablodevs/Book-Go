import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

export const AdminProducts = () => {
	const { actions, store } = useContext(Context);

	const [productList, setProductList] = useState([]);
	const [data, setData] = useState({
		product: null, // con 'name' no funciona bien
		price: null,
		description: null
	});

	useEffect(() => {
		setProductList(store.products.map(element => element.name));
	}, []);

	const handleproductListChange = e => console.log(productList[e.target.value]);

	const submitForm = event => {
		event.preventDefault();
		// actions.updateUser(data);
	};

	const handleInputChange = e => {
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
							<div className="admin-form- products-input">
								<label className="dashboard-label" htmlFor="product">
									Producto
								</label>
								<div className="dashboard-input">
									<input
										onBlur={e => {
											if (!productList.includes(e.target.value))
												e.target.classList.add("input-error");
											else e.target.classList.remove("input-error");
										}}
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
											setData({
												...data,
												product: ""
											});
										}}>
										<i className="fas fa-times" />
									</button>
								</div>
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
										onChange={e => {
											handleInputChange(e);
										}}
										value={data.price}
									/>
									<span>€</span>
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
				{/* <div className="horizontal-divider" /> */}
				<section className="disponibility">
					<form className="dashboard-forms" onSubmit={submitForm}>
						<div className="disponibility-title admin-form-group">
							<h2 className="dashboard-content-subtitle">Disponibilidad:</h2>
							<span>
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
