import React from "react";
import PropTypes from "prop-types";

export const Day = props => {
	return <button className="day">{props.number}</button>;
};

Day.propTypes = {
	number: PropTypes.number
};
