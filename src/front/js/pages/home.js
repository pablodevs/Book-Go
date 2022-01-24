import React, { useEffect, useContext } from "react";
import { ServiceCard } from "../component/home_components/service_card";
import { ScrollTop } from "../component/scrollTopButton";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/pages/home.scss";

export const Home = () => {
	const { actions, store } = useContext(Context);

	useEffect(() => {
		actions.get_services();
		actions.getBusinessInfo();
		actions.reset();
	}, []);

	return (
		<div className="container-fluid view">
			<div className="container home-background">
				<img src="https://pixabay.com/get/g7ad0e7b965337f47bd5db6b959c0c3947ac1854b4007bbf64c46cf0df7ce49da7e21641733b7f7e38621f305748ff2f04ed39b50805a31696c95f0b51c0d55d898ff4702a4c96bc3570bc15982e9896d_1920.jpg" />
				<Link
					type="button"
					className="btn btn-home mt-auto full-width"
					to="#"
					onClick={() => actions.setPopup("booking", "¿Qué estás buscando?")}>
					¡Reserva aquí!
				</Link>
			</div>
			<div className="container-fluid my-5 mx-auto">
				{store.services.length > 0 ? (
					<div className="row gap-5 justify-content-center">
						{store.services.map((item, index) => {
							if (item.is_active)
								return (
									<div className="col-auto" key={index}>
										<ServiceCard service={item} />
									</div>
								);
						})}
					</div>
				) : (
					""
				)}
			</div>
			<ScrollTop />
		</div>
	);
};
