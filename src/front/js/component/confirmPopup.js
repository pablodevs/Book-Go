import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Context } from "../store/appContext";

export const ConfirmPopup = props => {
	const { actions, store } = useContext(Context);

	const handleSubmit = event => {
		event.preventDefault();
		// actions...
		actions.closePopup();
	};

	return (
		<div className="popup-body">
			<div className="confirm-message">Esta acción no podrá deshacerse</div>
			<button className="btn-cool danger logout" onClick={store.popupFunct}>
				Confirmar
				<i className="fas fa-trash-alt" />
			</button>
		</div>
	);
};

ConfirmPopup.propTypes = {
	message: PropTypes.string
};
