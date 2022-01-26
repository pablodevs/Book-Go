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
				className={"btn-cool" + (store.popupObj.style === "success" ? " btn-confirm" : " danger")}
				onClick={() => {
					actions.setToast(
						"promise",
						{ loading: store.popupObj.toast.loading, success: store.popupObj.toast.success },
						store.popupFunct(),
						`toast-${store.popupObj.style || "danger"}`
					);
				}}>
				{store.popupObj.button}
				{store.popupObj.style === "success" ? (
					<i className="fas fa-check" />
				) : (
					<i className="fas fa-trash-alt" />
				)}
			</button>
		</div>
	);
};
