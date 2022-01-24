import React, { useContext } from "react";
import { Context } from "../../store/appContext";

export const ConfirmPopup = () => {
	const { actions, store } = useContext(Context);

	return (
		<div className="popup-body justify-content-center mb-5 mb-md-0">
			<p className="confirm-message" style={{ maxWidth: "300px", fontSize: "1.2rem" }}>
				{store.popupObj.message}
			</p>
			<button
				className="btn-cool danger"
				onClick={() => {
					actions.setToast(
						"promise",
						{ loading: store.popupObj.toast.loading, success: store.popupObj.toast.success },
						store.popupFunct(),
						"toast-danger"
					);
				}}>
				{store.popupObj.button}
				<i className="fas fa-trash-alt" />
			</button>
		</div>
	);
};
