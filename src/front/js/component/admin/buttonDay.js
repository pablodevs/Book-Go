import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext";
import PropTypes from "prop-types";

export const ButtonDay = props => {
	const { actions, store } = useContext(Context);

	return (
		<button
			onClick={() => actions.setActiveWeekDay(props.weekday)}
			className={
				"icon-btn" +
				(store.activeWeekDays &&
				store.activeWeekDays.length !== 0 &&
				store.activeWeekDays.includes(props.weekday)
					? " active"
					: "")
			}>
			{props.weekday}
		</button>
	);
};

ButtonDay.propTypes = {
	weekday: PropTypes.string
};
