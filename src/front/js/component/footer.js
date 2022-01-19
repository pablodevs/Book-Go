import React, { useEffect } from "react";
import "../../styles/components/footer.scss";

export const Footer = () => (
	<footer className="footer py-3 text-center sticky-bottom">
		<div className="container">
			<div className="row">
				{/* Contact Data */}
				<div className="col">
					<h5>Contacto: </h5>
					<ul className="nav flex-column">
						<li className="nav-item mb-2">
							<p>Teléfono: (+34) 123 456 789</p>
						</li>
						<li className="nav-item mb-2">
							<p>Email: spa@jmanvel.com</p>
						</li>
						<li className="nav-item mb-2">
							<p>Skype: @spa</p>
						</li>
					</ul>
				</div>
				{/* Social Media buttons */}
				<div className="col">
					<h5>Siguenos: </h5>
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
						<h5>Subscríbete : </h5>

						<div className="row gap-2">
							<input id="newsletter1" type="text" className="col-md-12 col-sm-12" placeholder="Email " />
							<button className="btn btn-primary col-md-5 col-sm-12" type="button">
								Subcríbete
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
		{/* Copyrights */}
		<div>
			<p>&#169; Pablo, Chavi & Clara. 20220 Todos los derechos reservados</p>
		</div>
	</footer>
);
