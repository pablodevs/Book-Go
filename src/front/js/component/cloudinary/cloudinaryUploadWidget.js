import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Context } from "../../store/appContext";

export const CloudinaryUploadWidget = props => {
	const [content, setContent] = useState(null);
	const { actions, store } = useContext(Context);

	useEffect(
		() => {
			if (store.image_url) setContent(props.successComp);
		},
		[store.image_url]
	);

	useEffect(
		() => {
			const options = {
				cloudName: "peibol888",
				uploadPreset: props.preset,
				apiKey: process.env.API_KEY,
				language: "en",
				text: {
					en: {
						or: "o",
						back: "Atrás",
						menu: {
							files: "Mis archivos",
							camera: "Cámara"
						},
						crop: {
							title: "Recorta tu imagen",
							crop_btn: "Recortar",
							skip_btn: "Omitir",
							reset_btn: "Deshacer"
						},
						local: {
							browse: "Seleccionar",
							dd_title_single: "Arrastra la imagen aquí",
							drop_title_single: "Suelta la imagen"
						},
						camera: {
							capture: "Tomar foto",
							cancel: "Cancelar",
							take_pic: "Toma una foto y súbela",
							explanation:
								"Asegúrate de que tu cámara está conectada y que tu navegador permite tomar fotos. Cuando estés listo. Pulsa el botón de Tomar foto."
						},
						actions: {
							upload: "Subir",
							next: "Siguiente"
						},
						queue: {
							title: "Cola de carga",
							title_uploading_with_counter: "Subiendo {{num}} Imágenes",
							abort_all: "Cancelar",
							retry_failed: "Intentar de nuevo",
							done: "Hecho",
							statuses: {
								uploading: "Subiendo...",
								error: "Error",
								uploaded: "Hecho",
								aborted: "Cancelado"
							}
						}
					}
				},
				sources: ["local", "camera"],
				showAdvancedOptions: false,
				cropping: true,
				multiple: false,
				defaultSource: "local",
				styles: {
					palette: {
						window: "#ffffff",
						sourceBg: "#D9FBFF",
						windowBorder: "#90a0b3",
						tabIcon: "#000000",
						inactiveTabIcon: "#555a5f",
						menuIcons: "#555a5f",
						link: "#44A8B7",
						action: "#4B6D9D",
						inProgress: "#D9FBFF",
						complete: "#15D715",
						error: "#D07A79",
						textDark: "#242727",
						textLight: "#F5F5F5"
					},
					fonts: {
						default: null,
						"'Poppins', sans-serif": {
							url: "https://fonts.googleapis.com/css?family=Poppins",
							active: true
						}
					}
				}
			};

			// const contentToRender = <WidgetButton title={props.title} funct={() => actions.setWidget(true)} />;

			var myWidget = window.cloudinary.createUploadWidget(options, (error, result) => {
				if (!error && result && result.event === "success") {
					actions.setImageURL(result.info.url);
				} else if (result && (result.event === "close" || result.event === "abort") && !store.image_url) {
					actions.setWidget(false);
					setContent(props.defaultComp);
				}
			});
			if (store.widget) {
				myWidget.open();
				if (props.loadingComp) setContent(props.loadingComp);
			} else setContent(props.defaultComp);
		},
		[store.widget]
	);

	return <div style={{ width: "fit-content", margin: "auto" }}>{content}</div>;
};

CloudinaryUploadWidget.propTypes = {
	preset: PropTypes.string,
	defaultComp: PropTypes.element,
	loadingComp: PropTypes.element,
	successComp: PropTypes.element
};
