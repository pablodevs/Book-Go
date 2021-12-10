import React, { useContext } from "react";
import { Context } from "../../store/appContext";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../../../styles/components/calendar.scss";

export const Day = props => {
	const { store, actions } = useContext(Context);
	return (
		<Link
			to={props.isPast || props.isChangeMonthDay || props.isChangeMonthDay === 0 ? "#" : "/"}
			className={
				"center day" +
				(props.isPast ? " disabled" : "") +
				(props.isToday ? " today" : "") +
				(props.isChangeMonthDay || props.isChangeMonthDay === 0 ? " light-fc-day" : "")
			}
			onClick={
				props.isChangeMonthDay || props.isChangeMonthDay === 0
					? () => actions.calendarActions.updateCalendar(props.isChangeMonthDay)
					: () => undefined
			}>
			{props.date.getDate()}
		</Link>
	);
};

Day.propTypes = {
	date: PropTypes.object,
	isToday: PropTypes.bool,
	isPast: PropTypes.bool,
	isChangeMonthDay: PropTypes.number
};
