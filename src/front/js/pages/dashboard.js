import React, { useEffect, useContext } from "react";
import "../../styles/pages/home.scss";
import { Context } from "../store/appContext";

export const Dashboard = () => {
	const { actions, store } = useContext(Context);

	useEffect(() => {}, []);

	return <div className="view">{store.token ? <h1>Estás en tu escritorio privado</h1> : ""}</div>;
};
