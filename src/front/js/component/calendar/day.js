import React from "react";
import PropTypes from "prop-types";
import "../../../styles/components/calendar.scss";

export const Day = props => {
	return (
		<button className={"day" + (props.isLight ? " light-color-day" : "") + (props.isToday ? " today" : "")}>
			{props.date.getDate()}
		</button>
	);
};

Day.propTypes = {
	date: PropTypes.object,
	isLight: PropTypes.bool,
	isToday: PropTypes.bool
};
