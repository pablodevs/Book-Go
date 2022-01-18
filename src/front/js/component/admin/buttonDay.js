import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import PropTypes from "prop-types";

export const ButtonDay = props => {
	const { actions, store } = useContext(Context);

	return (
		<button
			type="button"
			onClick={() => actions.setActiveWeekDay(props.weekday)}
			className={
				"icon-btn" +
				(store.business.weekdays &&
				store.business.weekdays.length !== 0 &&
				store.business.weekdays.includes(props.weekday)
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
