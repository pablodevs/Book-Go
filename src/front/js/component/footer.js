import React from "react";
import "../../styles/components/footer.scss";

export const Footer = () => (
	<footer className="py-3 text-center text-light bg-dark sticky-bottom">
		<p>&#169; Pablo, Jaime & Clara. 2021 All rigths reserved</p>
		<p>example@example.com</p>
		<a
			target="_blank"
			rel="noopener noreferrer"
			href="https://www.facebook.com/"
			className="fab fa-instagram footer-link"
		/>
		<a
			target="_blank"
			rel="noopener noreferrer"
			href="https://www.instagram.com/"
			className="fab fa-facebook-square footer-link"
		/>
		<a
			target="_blank"
			rel="noopener noreferrer"
			href="https://twitter.com/"
			className="fab fa-twitter footer-link"
		/>
	</footer>
);
