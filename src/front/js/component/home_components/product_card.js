import React from "react";
import manicura from "./../../../img/manicura.jpg";
import PropTypes from "prop-types";

export const Product_card = props => {
	return (
		<div className="card m-3" style={{ width: "18rem" }}>
			<img src={manicura} className="card-img-top" alt="..." style={{ width: "18rem" }} />
			<div className="card-body">
				<h5 className="card-title">{props.product.name}</h5>
				<p className="card-text">{props.product.description}</p>
				<a href="#" className="btn btn-success mt-2">
					Reservar
				</a>
			</div>
		</div>
	);
};

Product_card.propTypes = {
	product: PropTypes.object
};
