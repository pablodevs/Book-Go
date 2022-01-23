import React, { useContext } from "react";
import { Context } from "../../store/appContext";

export const ConfirmPopup = () => {
	const { actions, store } = useContext(Context);

	return (
		<div className="popup-body">
			<div className="confirm-message">Esta acción no podrá deshacerse</div>
			<button
				className="btn-cool danger"
				onClick={() => {
					actions.setToast(
						"promise",
						{ loading: "Eliminando...", success: () => "Eliminado" },
						store.popupFunct(),
						"toast-danger"
					);
				}}>
				Eliminar
				<i className="fas fa-trash-alt" />
			</button>
		</div>
	);
};
