import React, { useContext } from "react";
import { Context } from "../../store/appContext.js";
import "../../../styles/components/loginpopup.scss";

export const LoginPopup = () => {
	const { store, actions } = useContext(Context);
	return (
		<div className="popup login">
			<div className="popup-header">
				<h1 className="popup-header-title">LOGIN</h1>
				<button onClick={() => actions.setBool("navbarLogin", "close")}>
					<i className="fas fa-times" />
				</button>
			</div>
		</div>
	);
};
