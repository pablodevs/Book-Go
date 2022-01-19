import React, { useEffect, useContext } from "react";
import { ServiceCard } from "../component/home_components/service_card";
import { Panel } from "../component/home_components/panel";
import { Carrousel } from "../component/home_components/carrousel";
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
			<div className="row">
				<div className="mx-auto col-md-12 col-xl-5">
					<Panel />
				</div>
				<div className="mx-auto col-md-12 col-xl-5">
					<h1 className="text-center pt-5">Health inside!</h1>
					<h5 className="p-4">
						Nuestro enfoque es traer conciencia al cuerpo, la mente y el espíritu al abrir el camino hacia
						la curación y el descanso. Nos esforzamos por llevar a los clientes por un camino de bienestar y
						paz para facilitar mejor su capacidad de curación innata. Creemos que cada persona es única y
						tiene un don único y estamos comprometidos a facilitar su viaje de curación. Brindamos sesiones
						personalizadas que lo guían hacia la plenitud. También ofrecemos una variedad de servicios que
						incluyen masajes, sanación energética y servicios de spa.
					</h5>
					<h5 className="p-4">
						Te invitamos a descubrir tu verdadero yo y a conectarte con tu sabiduría interior y tu fuerza
						interior.
					</h5>
				</div>
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
		</div>
	);
};
