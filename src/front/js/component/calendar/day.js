import React, { useContext } from "react";
import { Context } from "../../store/appContext";
import PropTypes from "prop-types";
import "../../../styles/components/calendar.scss";
import { Link } from "react-router-dom";

export const Day = props => {
	const { store, actions } = useContext(Context);
	return (
		<>
			{props.isChangeMonthDay !== undefined ? (
				<button
					className={"center day" + (props.isLight ? " light-color-day" : "")}
					onClick={() => actions.calendarActions.updateCalendar(props.isChangeMonthDay)}>
					{props.date.getDate()}
				</button>
			) : (
				<Link
					to={props.isPast ? "#" : "/"}
					className={
						"center day" +
						(props.isPast ? " disabled" : "") +
						(props.isLight ? " light-color-day" : "") +
						(props.isToday ? " today" : "")
					}>
					{props.date.getDate()}
				</Link>
			)}
		</>
	);
};

Day.propTypes = {
	date: PropTypes.object,
	isLight: PropTypes.bool,
	isToday: PropTypes.bool,
	isPast: PropTypes.bool,
	isChangeMonthDay: PropTypes.bool
};
