import React, { useEffect, useContext } from "react";
import { Service_card } from "../component/home_components/service_card";
import { Carrousel } from "../component/home_components/carrousel";
import { Context } from "../store/appContext";
import "../../styles/pages/home.scss";

export const Home = () => {
	const { actions, store } = useContext(Context);

	useEffect(() => {
		actions.get_services();
		actions.getBusinessInfo();
	}, []);

	return (
		<div className="container-fluid view">
			<div className="row">
				<div className="mx-auto col-md-12 col-xl-5">
					<Carrousel />
				</div>
				<div className="mx-auto col-md-12 col-xl-5">
					<h1 className="text-center pt-5">Health inside!</h1>
					<h5 className="p-5">
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores voluptatum cupiditate
						aliquam repellat sapiente nisi nemo similique impedit aliquid? Hic, saepe harum. Autem est
						consequuntur, vel inventore nam similique reprehenderit.
					</h5>
					<h5 className="p-5">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab quaerat voluptatem odit impedit
						suscipit fugiat, nostrum distinctio dicta voluptates libero corrupti recusandae, quo id vero
						quis, non minima amet doloremque.
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
										<Service_card service={item} />
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
