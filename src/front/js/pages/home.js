import React from "react";
import "../../styles/home.scss";

export const Home = () => {
	return (
		<div className="view">
			<h1 className="text-center">This is the HOME page</h1>
			<h4 className="text-center mx-5">
				Cualquier contenido aparecerá siempre centrado y ocupando todo el alto de la pantalla por defecto
				gracias a los estilos aplicados a .view y #app
			</h4>
		</div>
	);
};
