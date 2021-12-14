import React, { useEffect, useContext } from "react";
import "../../styles/pages/home.scss";
import { Context } from "../store/appContext";
import { Redirect } from "react-router-dom";

export const Dashboard = () => {
	const { actions, store } = useContext(Context);

	useEffect(() => {}, []);

	return <div className="view">{store.token ? <Redirect to="/profile" /> : <Redirect to="/" />}</div>;
};
