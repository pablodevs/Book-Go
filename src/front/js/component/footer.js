import React, { useEffect } from "react";
import "../../styles/components/footer.scss";

export const Footer = () => (
	<footer className="footer py-3 text-center sticky-bottom">
		<div className="container">
			<div className="row">
				{/* Contact Data */}
				<div className="col">
					<h5>Contact Us</h5>
					<ul className="nav flex-column">
						<li className="nav-item mb-2">Cast: (+34) 123 456 789</li>
						<li className="nav-item mb-2">Email: email@email.com</li>
						<li className="nav-item mb-2">Skype: @email</li>
					</ul>
				</div>
				{/* Social Media buttons */}
				<div className="col">
					<h5>Follow Us</h5>
					<ul className="nav justify-content-center p-3">
						<li className="nav-item mb-2">
							<a
								target="_blank"
								rel="noopener noreferrer"
								href="https://www.facebook.com/"
								className="fab fa-facebook-square footer-link"
							/>
						</li>
						<li className="nav-item mb-2">
							<a
								target="_blank"
								rel="noopener noreferrer"
								href="https://www.instagram.com/"
								className="fab fa-instagram footer-link"
							/>
						</li>
						<li className="nav-item mb-2">
							<a
								target="_blank"
								rel="noopener noreferrer"
								href="https://twitter.com/"
								className="fab fa-twitter footer-link"
							/>
						</li>
					</ul>
				</div>
			</div>
			<div className="row justify-content-center">
				{/* Form to subscribe to newsletter */}
				<div className="col-md-3 py-3">
					<form>
						<h5>Subscribe to our newsletter</h5>
						<div>Monthly digest of whats new and exciting from us.</div>
						<div className="row gap-2">
							<input
								id="newsletter1"
								type="text"
								className="col-md-12 col-sm-12"
								placeholder="Email address"
							/>
							<button className="btn btn-primary col-md-5 col-sm-12" type="button">
								Subscribe
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
		{/* Copyrights */}
		<div>&#169; Pablo, Chavi & Clara. 2021 All rights reserved</div>
	</footer>
);
