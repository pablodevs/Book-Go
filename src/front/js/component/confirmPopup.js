import React, { useContext } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
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
			<button
				className="btn-cool danger logout"
				onClick={() => {
					toast.promise(store.popupFunct(), {
						loading: "Cargando...",
						success: "Eliminado",
						error: () => `Error: ${store.message}`
					});
				}}>
				Eliminar
				<i className="fas fa-trash-alt" />
			</button>
		</div>
	);
};

ConfirmPopup.propTypes = {
	message: PropTypes.string
};
