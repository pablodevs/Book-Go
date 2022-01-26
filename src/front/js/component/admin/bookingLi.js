import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import PropTypes from "prop-types";

export const BookingLi = props => {
	const { actions, store } = useContext(Context);

	return <ul className="bookingLi">{props.bookID}</ul>;
};

BookingLi.propTypes = {
	date: PropTypes.object,
	service: PropTypes.object,
	status: PropTypes.string,
	bookID: PropTypes.number
};
