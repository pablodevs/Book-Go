import React from "react";
import PropTypes from "prop-types";
import "../../../styles/components/calendar.scss";
import { Link } from "react-router-dom";

export const Day = props => {
	return (
		<Link
			to="/"
			className={
				"center day" + (props.isLight ? " light-color-day disabled" : "") + (props.isToday ? " today" : "")
			}>
			{props.date.getDate()}
		</Link>
	);
};

Day.propTypes = {
	date: PropTypes.object,
	isLight: PropTypes.bool,
	isToday: PropTypes.bool
};
