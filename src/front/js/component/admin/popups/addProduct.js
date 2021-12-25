import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../store/appContext";

export const AddProduct = () => {
	const { actions, store } = useContext(Context);
	const [data, setData] = useState({
		name: "",
		price: "",
		description: ""
		// product_img_url: "",
	});

	const handleInputChange = e => setData({ ...data, [e.target.name]: e.target.value });

	const handleSubmit = event => {
		event.preventDefault();
		if (data.name !== "" && data.price !== "" && data.description !== "") {
			actions.addProduct(data);
			actions.closePopup();
		}
	};

	return (
		<div className="popup-body center">
			<form onSubmit={handleSubmit} className="dashboard-form">
				<p>Puedes modificar la información del producto más adelante</p>
				<div className="admin-form-group">
					<div className="admin-form-subgroup">
						<label className="dashboard-label" htmlFor="new-product">
							Nuevo producto:
						</label>
						<div className="dashboard-input">
							<input
								id="new-product"
								type="text"
								name="name"
								value={data.name}
								autoComplete="off"
								onChange={e => setData({ ...data, name: e.target.value })}
								required
							/>
							<button
								type="button"
								className="clear-input"
								onClick={() => {
									setData({
										...data,
										name: ""
									});
								}}>
								<i className="fas fa-times" />
							</button>
						</div>
					</div>
				</div>
				<div className="admin-form-group">
					<div className="admin-form-subgroup price-subgroup">
						<label className="dashboard-label" htmlFor="new-price">
							Precio
						</label>
						<div className="price-input">
							<input
								type="number"
								id="new-price"
								name="price"
								min="0"
								onChange={e => handleInputChange(e)}
								value={data.price}
								required
							/>
							<span>€</span>
						</div>
					</div>
					<div className="admin-form-subgroup">
						<label htmlFor="new-description" className="dashboard-label">
							Descripción
						</label>
						<textarea
							id="new-description"
							name="description"
							rows="3"
							value={data.description}
							onChange={e => handleInputChange(e)}
							required
						/>
					</div>
					<div className="admin-form-subgroup img-subgroup">
						<div className="admin-product-img-wrapper">
							<small className="img-placeholder">
								<i className="fas fa-camera" />
							</small>
							<button type="button" className="edit-img" onClick={() => undefined}>
								<i className="fas fa-camera" />
							</button>
						</div>
					</div>
				</div>
				<div>
					<button type="submit" className="save-button">
						Añadir
					</button>
				</div>
			</form>
		</div>
	);
};
