import React, { useContext, useState } from "react";
import { Context } from "../../../store/appContext";
import PropTypes from "prop-types";
import "../../../../styles/components/calendar.scss";

export const Day = props => {
	const { store, actions } = useContext(Context);
	const [hover, setHover] = useState(false);

	return (
		<div className="day-wrapper">
			<button
				className={
					"center day" +
					((props.isPast || props.isDisabled) && !(props.isChangeMonthDay || props.isChangeMonthDay === 0)
						? " disabled"
						: "") +
					(props.isToday ? " today" : "") +
					(props.isChangeMonthDay || props.isChangeMonthDay === 0
						? " light-fc-day"
						: store.booking.date ===
						  props.date.toLocaleDateString(undefined, {
								year: "numeric",
								month: "2-digit",
								day: "2-digit"
						  })
							? " day-active"
							: hover
								? " hover"
								: "")
				}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onClick={
					props.isChangeMonthDay || props.isChangeMonthDay === 0
						? () => actions.calendarActions.updateCalendar(props.isChangeMonthDay)
						: () =>
								//al hacer click en un día te aparecen las horas disponibles
								actions.updateBooking(
									"date",
									props.date.toLocaleDateString(undefined, {
										year: "numeric",
										month: "2-digit",
										day: "2-digit"
									})
								)
				}>
				{props.date.getDate()}
			</button>
		</div>
	);
};

Day.propTypes = {
	date: PropTypes.object,
	isToday: PropTypes.bool,
	isPast: PropTypes.bool,
	isDisabled: PropTypes.bool,
	isChangeMonthDay: PropTypes.number
};
