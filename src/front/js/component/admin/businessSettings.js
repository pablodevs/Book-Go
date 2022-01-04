import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

export const BusinessSettings = () => {
	const { actions, store } = useContext(Context);

	const [data, setData] = useState({
		address: "",
		businessPhone: ""
	});
	const [socialMedia, setSocialMedia] = useState({
		facebook: store.socialMedia.facebook,
		instagram: store.socialMedia.instagram,
		twitter: store.socialMedia.twitter
	});

	useEffect(() => {
		return;
		// setSocialMedia({
		// 	facebook: store.socialMedia.facebook,
		// 	instagram: store.socialMedia.instagram,
		// 	twitter: store.socialMedia.twitter
		// });
	}, []);

	const submitForm = event => {
		event.preventDefault();
		let socialMediaAux = {
			facebook: socialMedia.facebook,
			instagram: socialMedia.instagram,
			twitter: socialMedia.twitter
		};
		// TODAVÍA NO EXISTE EN LA BASE DE DATOS
		actions.updateSocialMedia(socialMediaAux);
		// actions.updateBusinessInfo(data);
	};

	const handleInputChange = e => {
		setData({
			...data,
			[e.target.name]: e.target.value
		});
	};
	const handleSocMedChange = e => {
		setSocialMedia({
			...socialMedia,
			[e.target.name]: e.target.value
		});
	};

	return (
		// PODER CAMBIAR LA FOTO DE PORTADA (NO HABRÁ CAROUSEL)
		<form onSubmit={submitForm} className="dashboard-form">
			<h2 className="dashboard-content-subtitle">Detalles del negocio</h2>
			<div>
				<label className="dashboard-label" htmlFor="address">
					Dirección
				</label>
				<div className="dashboard-input">
					<input
						onChange={e => {
							handleInputChange(e);
						}}
						type="text"
						id="address"
						name="address"
						value={data.address}
						placeholder="C/..."
					/>
					<button
						type="button"
						className="clear-input"
						onClick={() => {
							setData({
								...data,
								address: ""
							});
						}}>
						<i className="fas fa-times" />
					</button>
				</div>
			</div>
			<div>
				<label className="dashboard-label" htmlFor="businessPhone">
					Teléfono del establecimiento
				</label>
				<div className="dashboard-input">
					<input
						onChange={e => {
							handleInputChange(e);
						}}
						type="tel"
						id="businessPhone"
						name="businessPhone"
						value={data.businessPhone}
						placeholder="teléfono de contacto..."
					/>
					<button
						type="button"
						className="clear-input"
						onClick={() => {
							setData({
								...data,
								businessPhone: ""
							});
						}}>
						<i className="fas fa-times" />
					</button>
				</div>
			</div>
			<h2 className="dashboard-content-subtitle">Redes sociales</h2>
			<div className="socialMedia-input">
				<label className="dashboard-label" htmlFor="facebook">
					<i className="fab fa-facebook-square" />
				</label>
				<div className="dashboard-input">
					<input
						onChange={e => {
							handleSocMedChange(e);
						}}
						type="text"
						id="facebook"
						name="facebook"
						value={socialMedia.facebook}
						placeholder="https://facebook.com/"
					/>
					<button
						type="button"
						className="clear-input"
						onClick={() => {
							setSocialMedia({
								...socialMedia,
								facebook: ""
							});
						}}>
						<i className="fas fa-times" />
					</button>
				</div>
			</div>
			<div className="socialMedia-input">
				<label className="dashboard-label" htmlFor="instagram">
					<i className="fab fa-instagram" />
				</label>
				<div className="dashboard-input">
					<input
						onChange={e => {
							handleSocMedChange(e);
						}}
						type="text"
						id="instagram"
						name="instagram"
						value={socialMedia.instagram}
						placeholder="https://instagram.com/"
					/>
					<button
						type="button"
						className="clear-input"
						onClick={() =>
							setSocialMedia({
								...socialMedia,
								instagram: ""
							})
						}>
						<i className="fas fa-times" />
					</button>
				</div>
			</div>
			<div className="socialMedia-input">
				<label className="dashboard-label" htmlFor="twitter">
					<i className="fab fa-twitter" />
				</label>
				<div className="dashboard-input">
					<input
						onChange={e => {
							handleSocMedChange(e);
						}}
						type="mail"
						id="twitter"
						name="twitter"
						value={socialMedia.twitter}
						placeholder="https://twitter.com/"
					/>
					<button
						type="button"
						className="clear-input"
						onClick={() =>
							setSocialMedia({
								...socialMedia,
								twitter: ""
							})
						}>
						<i className="fas fa-times" />
					</button>
				</div>
			</div>
			<div>
				<button type="submit" className="save-button">
					Guardar cambios
				</button>
			</div>
		</form>
	);
};
