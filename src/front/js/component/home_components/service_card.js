import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const ServiceCard = props => {
	return (
		<div
			className="service-card card shadow rounded-3 card-background"
			style={{ border: "none", width: "15rem", height: "380px", overflow: "hidden" }}>
			<img
				src={require(`./../../../img/${props.service.name.toLowerCase()}.jpg`)}
				className="card-img-top"
				alt="..."
				style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }}
			/>
			<div className="card-body d-flex flex-column text-light" style={{ zIndex: "1", height: "175px" }}>
				<span className="card-title">{props.service.name}</span>
				<small className="card-text">{props.service.description}</small>
				<Link type="button" to={"/info/" + props.service.id} className="btn btn-info mt-auto">
					Más Info
				</Link>
			</div>
		</div>
	);
};

ServiceCard.propTypes = {
	service: PropTypes.object
};
