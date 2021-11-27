import React, { useContext } from "react";
import { Context } from "../../store/appContext";
import PropTypes from "prop-types";
import "../../../styles/components/calendar.scss";
import { Link } from "react-router-dom";

export const Day = props => {
	const { store, actions } = useContext(Context);
	props.isOnClickday !== undefined ? return <button
			className="center day light-color-day"
			onClick={() => actions.calendarActions.updateCalendar(props.isOnClickday) : ""}>
			{props.date.getDate()}
		</button> :
		return <Link
			to="/"
			className={"center day" + (props.isLight ? " light-color-day" : "") + (props.isToday ? " today" : "")}>
			{props.date.getDate()}
		</Link>
};

Day.propTypes = {
	date: PropTypes.object,
	isLight: PropTypes.bool,
	isToday: PropTypes.bool,
	isOnClickday: PropTypes.bool
};
