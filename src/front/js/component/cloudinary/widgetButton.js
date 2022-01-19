import React from "react";
import PropTypes from "prop-types";

export const WidgetButton = props => {
	return (
		<button id="upload_widget" className="input-button" type="button" onClick={props.funct}>
			<i className="fas fa-camera" />
			{props.title}
		</button>
	);
};

WidgetButton.propTypes = {
	funct: PropTypes.func,
	title: PropTypes.string
};
