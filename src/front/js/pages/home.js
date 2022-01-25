import React, { useEffect, useContext } from "react";
import { ServiceCard } from "../component/home_components/service_card";
import { ScrollTop } from "../component/scrollTopButton";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import home_img from "../../img/zen.jpg";
import "../../styles/pages/home.scss";

export const Home = () => {
	const { actions, store } = useContext(Context);

	useEffect(() => {
		actions.get_services();
		actions.getBusinessInfo();
		actions.resetBooking();
	}, []);

	return (
		<div className="container-fluid view">
			<div className="container home-background">
				<img src={home_img} />
				<Link
					type="button"
					className="btn btn-home mt-auto full-width"
					to="#"
					onClick={() => actions.setPopup("booking", "¿Qué estás buscando?")}>
					¡Reserva aquí!
				</Link>
			</div>
			<div className="container-fluid my-5 mx-auto" id="services">
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
