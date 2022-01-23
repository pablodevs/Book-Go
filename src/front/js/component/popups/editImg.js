import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { CloudinaryUploadWidget } from "../cloudinary/cloudinaryUploadWidget";

export const EditImg = () => {
	const { actions, store } = useContext(Context);

	return (
		<div className="popup-body">
			<span className={store.cloudinaryInfo.image_url ? "text-confirm" : ""}>
				{(store.popupObj.servce_img_url || store.popupObj.img_url) && !store.cloudinaryInfo.image_url
					? "Pulsa en la imagen para modificarla."
					: store.cloudinaryInfo.image_url
						? "Imagen subida corréctamente"
						: "Pulsa para añadir una imagen."}
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
						{store.popupObj.servce_img_url || store.popupObj.img_url ? (
							<img
								className="popup-service-img"
								src={store.popupObj.servce_img_url || store.popupObj.img_url}
							/>
						) : (
							""
						)}
					</button>
				}
				loadingComp={
					<button type="button" className="edit-img popup-edit-img">
						<div className="spinner-border-wrapper d-flex">
							<div className="spinner-border spinner-border-sm" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
						{store.popupObj.servce_img_url || store.popupObj.img_url ? (
							<img
								className="popup-service-img"
								src={store.popupObj.servce_img_url || store.popupObj.img_url}
							/>
						) : (
							""
						)}
					</button>
				}
				successComp={
					<div className="popup-edit-img">
						<img className="popup-service-img" src={store.cloudinaryInfo.image_url} />
					</div>
				}
			/>
			<div className="d-flex flex-row w-100">
				{store.popupObj.servce_img_url || store.popupObj.img_url || store.cloudinaryInfo.image_url ? (
					<button
						className={"mx-auto" + (store.cloudinaryInfo.image_url ? " btn-skip" : " btn-cool danger")}
						onClick={() => {
							if (store.cloudinaryInfo.image_url) actions.closePopup(true);
							else {
								let toastFunction = null;
								if (store.popupObj.servce_img_url)
									toastFunction = actions.updateService({
										id: store.popupObj.id,
										public_id: store.popupObj.public_id,
										method: "delete"
									});
								else if (store.popupObj.img_url) {
									let body = new FormData();
									body.append("profile_image_url", store.popupObj.img_url);
									body.append("public_id", store.popupObj.public_id);
									body.append("method", "delete");
									toastFunction = actions.updateUser(body);
								}
								actions.setToast(
									"promise",
									{ loading: "Eliminando...", success: "Imagen eliminada" },
									toastFunction,
									"toast-danger"
								);
							}
						}}>
						{store.cloudinaryInfo.image_url && store.cloudinaryInfo.public_id ? "Cancelar" : "Eliminar"}
						{store.cloudinaryInfo.image_url && store.cloudinaryInfo.public_id ? (
							""
						) : (
							<i className="fas fa-trash-alt" />
						)}
					</button>
				) : (
					""
				)}
				<button
					className="btn-cool btn-confirm"
					onClick={() => {
						if (!store.cloudinaryInfo.image_url) actions.closePopup();
						else {
							const method = store.popupObj.servce_img_url || store.popupObj.img_url ? "modify" : "add";

							let toastFunction = null;
							if (store.popupObj.servce_img_url)
								toastFunction = actions.updateService({
									id: store.popupObj.id,
									service_img_url: store.cloudinaryInfo.image_url,
									public_id: store.cloudinaryInfo.public_id,
									method: method
								});
							else if (store.popupObj.img_url) {
								let body = new FormData();
								body.append("profile_image_url", store.popupObj.img_url);
								body.append("public_id", store.popupObj.public_id);
								body.append("method", method);
								toastFunction = actions.updateUser(body);
							}

							actions.setToast(
								"promise",
								{ loading: "Guardando...", success: resp => `${resp.name} guardado` },
								toastFunction,
								"toast-success"
							);
							actions.resetCloudinaryInfo();
						}
					}}>
					Confirmar
				</button>
			</div>
		</div>
	);
};
