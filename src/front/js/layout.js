import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";

// Components
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

// Views
import { Home } from "./pages/home";
import { Otherpage } from "./pages/otherpage";
import { Calendar } from "./component/calendar";

import injectContext from "./store/appContext";

const Layout = () => {
	const basename = process.env.BASENAME || "";

	return (
		<BrowserRouter basename={basename}>
			<ScrollToTop>
				<Navbar />
				<Switch>
					<Route exact path="/">
						<Home />
					</Route>
					<Route exact path="/otherpage">
						<Otherpage />
					</Route>
					<Route exact path="/calendar">
						<Calendar />
					</Route>
					<Route>
						<div className="view">
							<h3>404 - Page Not Found</h3>
						</div>
					</Route>
				</Switch>
				<Footer />
			</ScrollToTop>
		</BrowserRouter>
	);
};

export default injectContext(Layout);
