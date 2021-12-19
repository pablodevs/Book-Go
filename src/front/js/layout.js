import React from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import injectContext from "./store/appContext";

// Components
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Popup } from "./component/popup";

// Views
import { Home } from "./pages/home";
import { Info } from "./pages/info";
import { Dashboard } from "./pages/dashboard";
import { AdminPanel } from "./pages/adminPanel";

const Layout = () => {
	const basename = process.env.BASENAME || "";

	return (
		<BrowserRouter basename={basename}>
			<ScrollToTop>
				<Navbar />
				<Popup />
				<Switch>
					<Route exact path="/">
						<Home />
					</Route>
					<Route exact path="/info/:id">
						<Info />
					</Route>
					<Route exact path="/dashboard">
						<Dashboard />
					</Route>
					<Route exact path="/admin">
						<AdminPanel />
					</Route>
					<Route>
						<div className="view">
							<h1 style={{ fontWeight: "bold", fontSize: "6rem", letterSpacing: "10px" }}>404</h1>
							<h3>Page not found</h3>
							<Link className="coolbtn" to="/" style={{ fontSize: "1.15rem" }}>
								Back to Home
							</Link>
						</div>
					</Route>
				</Switch>
				<Footer />
			</ScrollToTop>
		</BrowserRouter>
	);
};

export default injectContext(Layout);
