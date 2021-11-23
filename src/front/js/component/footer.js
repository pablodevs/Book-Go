import React, { Component } from "react";
import "../../styles/pages/footer.scss";

export const Footer = () => (
	<footer className="py-5 text-center text-light bg-dark sticky-bottom">
		<p>&#169; Pablo, Jaime & Clara. 2021 All rigths reserved</p>
		<p>example@example.com</p>
		<a href="https://www.facebook.com/" className="fab fa-instagram footer-link" />
		<a href="https://www.instagram.com/" className="fab fa-facebook-square footer-link" />
		<a href="https://twitter.com/" className="fab fa-twitter footer-link" />
	</footer>
);
