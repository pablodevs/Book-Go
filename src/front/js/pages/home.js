import React, { useEffect, useContext } from "react";
import { Product_card } from "../component/home_components/product_card";
import { Carrousel } from "../component/home_components/carrousel";
import { Context } from "../store/appContext";
import "../../styles/pages/home.scss";

export const Home = () => {
	const { actions, store } = useContext(Context);

	useEffect(() => {
		actions.get_products();
	}, []);

	return (
		<div className="container-fluid view">
			<div className="row">
				<div className="mx-auto col-md-12 col-xl-5">
					<Carrousel />
				</div>
				<div className="mx-auto col-md-12 col-xl-5">
					<h1 className="text-center pt-5">Healh inside !</h1>
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

			<div className="container my-5">
				{store.products.length > 0 ? (
					<div className="row gap-5 justify-content-center">
						{store.products.map((item, index) => (
							<div className="col-auto" key={index}>
								<Product_card product={item} />
							</div>
						))}
					</div>
				) : (
					""
				)}
			</div>
		</div>
	);
};
