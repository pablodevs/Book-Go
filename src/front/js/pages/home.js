import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ServiceCard } from "../component/home_components/service_card";
import { ScrollTop } from "../component/scrollTopButton";
import { Context } from "../store/appContext";
import text_divider from "../../img/text-divider.png";
import "../../styles/pages/home.scss";

export const Home = () => {
	const { actions, store } = useContext(Context);

	useEffect(() => {
		actions.get_services();
		actions.getBusinessInfo();
		actions.resetBooking();
	}, []);

	return (
		<div className="container-fluid home">
			<div className="home-background center">
				<button
					className="btn-cool btn-home"
					onClick={() => actions.setPopup("booking", "¿Qué estás buscando?")}>
					¡Reserva aquí!
				</button>
			</div>
			<div className="center home-subtitle-wrapper" id="services">
				<img src={text_divider} className="text-divider" />
				<h1 className="home-subtitle">
					Descubre nuestros <span className="emphasis">SERVICIOS</span>
				</h1>
				<img src={text_divider} className="text-divider" />
			</div>
			<div className="container-fluid mb-5 mx-auto px-3 pb-5">
				{store.services.length > 0 ? (
					<div className="row gap-5 justify-content-center">
						{store.services.map((item, index) => {
							if (item.is_active)
								return (
									<Link to={"/info/" + item.id} className="col-auto service-card-wrapper" key={index}>
										<ServiceCard service={item} />
									</Link>
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
