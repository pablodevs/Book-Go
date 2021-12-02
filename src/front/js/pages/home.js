import React, { useEffect, useContext } from "react";
import "../../styles/pages/home.scss";
import { Product_card } from "../component/home_components/product_card";
import { Carrousel } from "../component/home_components/carrousel";
import { Context } from "../store/appContext";

export const Home = () => {
	const { actions, store } = useContext(Context);

	useEffect(() => {
		actions.get_products();
	}, []);

	return (
		<div className="view">
			<h1 className="text-center">Bienvenidos a Home relax !</h1>
			<Carrousel />
			<div className="container-fluid">
				{store.products.length > 0 ? (
					<div className="row">
						{store.products.map((item, index) => (
							<div className="col" key={index}>
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
