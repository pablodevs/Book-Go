import React, { useContext } from "react";
import { Context } from "../../../store/appContext";

export const GuestConfirm = () => {
	const { actions, store } = useContext(Context);

	return (
		<div className="container-fluid my-auto">
			<div className="row">
				<div className="col mx-4 mb-4" style={{ display: "grid", gap: "1rem" }}>
					<p>¿Te gustaría que guardaramos tus datos para otra reserva?</p>
					<button
						className="btn btn-warning w-100"
						type="submit"
						onClick={() => actions.setPopup("userFromGuest", "Únete")}>
						Sí, ¡Gracias!
					</button>
					<div className="d-flex w-100 justify-content-center" onClick={() => actions.setPopup("", "")}>
						<button className="text-muted">Continuar sin guardar</button>
					</div>
				</div>
			</div>
		</div>
	);
};
