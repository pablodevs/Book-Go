import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Context } from "../../store/appContext";
import { Link } from "react-router-dom";

export const Product_card = props => {
	const { actions, store } = useContext(Context);

	return (
		<div
			className="card shadow rounded-3"
			style={{ border: "none", width: "15rem", height: "380px", overflow: "hidden" }}>
			<img
				src={require(`./../../../img/${props.product.name.toLowerCase()}.jpg`)}
				className="card-img-top"
				alt="..."
				style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }}
			/>
			<div className="card-body d-flex flex-column text-light" style={{ zIndex: "1" }}>
				<h5 className="card-title border-bottom pb-1">{props.product.name}</h5>
				<p className="card-text">{props.product.description}</p>
				<Link type="button" to={"/info/" + props.product.id} className="btn btn-info mt-auto">
					Más Info
				</Link>
			</div>
		</div>
	);
};

Product_card.propTypes = {
	product: PropTypes.object
};
