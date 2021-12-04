import React from "react";
import { Login_form } from "../component/login/login_form";
import { Signup } from "../component/login/signup";

export const Login = () => {
	return (
		<div>
			<h1 className="text-center text-warning mt-5 p-4">Login !</h1>
			<Login_form />
		</div>
	);
};
