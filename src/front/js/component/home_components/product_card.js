import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Context } from "../../store/appContext";
import { Link } from "react-router-dom";

export const Product_card = props => {
	const { actions, store } = useContext(Context);

	return (
		<div className="card m-3" style={{ width: "18rem" }}>
			<img
				src={require(`./../../../img/${props.product.name.toLowerCase()}.jpg`)}
				className="card-img-top"
				alt="..."
				style={{ width: "18rem" }}
			/>
			<div className="card-body">
				<h5 className="card-title">{props.product.name}</h5>
				<p className="card-text">{props.product.description}</p>
				<button
					className="btn btn-success mt-2"
					onClick={() => {
						actions.getProduct(props.product.id);
					}}>
					<Link to={"/info/" + props.product.id}>
						<span className="text-white">Más Info</span>
					</Link>
				</button>
			</div>
		</div>
	);
};

Product_card.propTypes = {
	product: PropTypes.object
};
