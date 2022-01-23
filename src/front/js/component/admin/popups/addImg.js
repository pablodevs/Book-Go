import React, { useContext } from "react";
import { Context } from "../../../store/appContext";
import { CloudinaryUploadWidget } from "../../cloudinary/cloudinaryUploadWidget";

export const AddImg = () => {
	const { actions, store } = useContext(Context);

	return (
		<div className="popup-body">
			<span className={store.cloudinaryInfo.image_url ? "text-confirm" : ""}>
				{store.cloudinaryInfo.image_url ? "Imagen subida corréctamente" : "Pulsa para añadir una imagen."}
			</span>
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
					<button type="button" className="edit-img popup-edit-img">
						<div className="spinner-border-wrapper d-flex">
							<div className="spinner-border spinner-border-sm" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					</button>
				}
				successComp={
					<div className="popup-edit-img">
						<img className="popup-service-img" src={store.cloudinaryInfo.image_url} />
					</div>
				}
			/>
			<button
				className="btn-cool btn-confirm"
				onClick={() => {
					let imgToSend = store.cloudinaryInfo.image_url || "";
					let publicIdToSend = store.cloudinaryInfo.public_id || "";
					actions.setToast(
						"promise",
						{ loading: "Guardando...", success: resp => `${resp.name} guardado` },
						actions.addService({
							...store.serviceInProgress,
							service_img_url: imgToSend,
							public_id: publicIdToSend
						}),
						"toast-success"
					);
				}}>
				{store.cloudinaryInfo.image_url && store.cloudinaryInfo.public_id
					? "Crear Servicio"
					: "Crear sin imagen"}
				{store.cloudinaryInfo.image_url && store.cloudinaryInfo.public_id ? (
					""
				) : (
					<i className="fas fa-arrow-right" />
				)}
			</button>
		</div>
	);
};
