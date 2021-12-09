import React from "react";
import "../../styles/components/footer.scss";

export const Footer = () => (
	<footer className="footer py-3 text-center sticky-bottom">
		<div className="container">
			<div className="row ">
				<div className="col-auto p-2">
					<h5>Contact Us</h5>
					<ul className="nav flex-column">
						<li className="nav-item mb-2">
							<p>Cast: (+34) 123 456 789</p>
						</li>
						<li className="nav-item mb-2">
							<p>Email: email@email.com</p>
						</li>
						<li className="nav-item mb-2">
							<p>Skype: @email</p>
						</li>
					</ul>
				</div>

				<div className="col-auto p-2">
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

				<div className="col-auto p-2">
					<form>
						<h5>Subscribe to our newsletter</h5>
						<p>Monthly digest of whats new and exciting from us.</p>
						<div className="d-flex w-100 gap-2">
							<label className="visually-hidden">Email address</label>
							<input id="newsletter1" type="text" className="form-control" placeholder="Email address" />
							<button className="btn btn-primary" type="button">
								Subscribe
							</button>
						</div>
					</form>
				</div>

				<div className="col-auto lh-sm p-2">
					<h5>Boring Stuff</h5>
					<p className="text-start">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod volutpat eros, sed
						varius sapien eleifend ac. Maecenas odio urna, lacinia in purus molestie
					</p>
				</div>
			</div>
		</div>
		<div>
			<p>&#169; Pablo, Chavi & Clara. 2021 All rigths reserved</p>
		</div>
	</footer>
);
