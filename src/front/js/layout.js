import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import injectContext from "./store/appContext";

// Components
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Calendar } from "./component/calendar/calendar";

// Views
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Signup } from "./component/login/signup";
import { Info } from "./pages/info";

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
					<Route exact path="/calendar">
						<Calendar />
					</Route>

					<Route exact path="/login">
						<Login />
					</Route>

					<Route exact path="/signup">
						<Signup />
					</Route>

					<Route exact path="/info/:id">
						<Info />
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
