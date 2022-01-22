import React, { useContext } from "react";
import { Context } from "../../../store/appContext";
import { CloudinaryUploadWidget } from "../../cloudinary/cloudinaryUploadWidget";

export const AddImg = () => {
	const { actions, store } = useContext(Context);

	return (
		<div className="popup-body">
			<CloudinaryUploadWidget
				preset="services_images"
				defaultComp={
					<button
						type="button"
						className="edit-img popup-edit-img"
						// On click: abrir un cuadro de dialogo pequeño para cambiar el nombre del servicio
						onClick={() => actions.setWidget(true)}>
						<i className="fas fa-camera" />
					</button>
				}
				loadingComp={
					<button type="button" className="edit-img edit-img-active popup-edit-img">
						<div className="spinner-border-wrapper d-flex">
							<div className="spinner-border spinner-border-sm" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					</button>
				}
				successComp={<img className="popup-service-img" src={store.image_url} />}
			/>
			<div className="d-flex flex-row">
				{store.image_url ? (
					<button
						className="btn-cool btn-confirm"
						onClick={() =>
							actions.setToast(
								"promise",
								{ loading: "Añadiendo...", success: resp => `Servicio agregado: ${resp.name}` },
								actions.addService({
									...store.serviceInProgress,
									service_img_url: store.image_url
								}),
								"toast-success"
							)
						}>
						Confirmar
					</button>
				) : (
					""
				)}
				<button
					type="button"
					className="btn-cool"
					onClick={() =>
						actions.setToast(
							"promise",
							{ loading: "Añadiendo...", success: resp => `Servicio agregado: ${resp.name}` },
							actions.addService(store.serviceInProgress),
							"toast-success"
						)
					}>
					Crear sin imagen
					<i className="fas fa-arrow-right" />
				</button>
			</div>
		</div>
	);
};
