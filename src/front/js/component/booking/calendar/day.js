import React, { useContext } from "react";
import { Context } from "../../../store/appContext";
import PropTypes from "prop-types";
import "../../../../styles/components/calendar.scss";

export const Day = props => {
	const { store, actions } = useContext(Context);
	return (
		<button
			className={
				"center day" +
				((props.isPast || props.isDisabled) && !(props.isChangeMonthDay || props.isChangeMonthDay === 0)
					? " disabled"
					: "") +
				(props.isToday ? " today" : "") +
				(props.isChangeMonthDay || props.isChangeMonthDay === 0 ? " light-fc-day" : "")
			}
			onClick={
				props.isChangeMonthDay || props.isChangeMonthDay === 0
					? () => actions.calendarActions.updateCalendar(props.isChangeMonthDay)
					: //al hacer click en un día que tiene disponibilidad.... te aparecen las horas disponibles
					  () => {
							actions.calendarActions.changeHoursView(
								props.date.getDate() +
									"/" +
									//quito los ceros delante del mes que sea menor a 10
									((props.date.getMonth() + 1) * 1).toString() +
									"/" +
									props.date.getFullYear()
							);
					  }
			}>
			{props.date.getDate()}
		</button>
	);
};

Day.propTypes = {
	date: PropTypes.object,
	isToday: PropTypes.bool,
	isPast: PropTypes.bool,
	isDisabled: PropTypes.bool,
	isChangeMonthDay: PropTypes.number
};
