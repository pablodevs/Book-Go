import React from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import injectContext from "./store/appContext";

// Components
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Popup } from "./component/popup";
import toast, { ToastBar, Toaster } from "react-hot-toast";

// Views
import { Home } from "./pages/home";
import { Info } from "./pages/info";
import { Dashboard } from "./pages/dashboard";
import { AdminPanel } from "./pages/adminPanel";

const Layout = () => {
	const basename = process.env.BASENAME || "";

	return (
		<BrowserRouter basename={basename}>
			<Toaster>
				{t => (
					<ToastBar toast={t}>
						{({ icon, message }) => (
							<>
								{icon}
								{message}
								{t.type !== "loading" && (
									<button className="toast-close" onClick={() => toast.dismiss(t.id)}>
										×
									</button>
								)}
							</>
						)}
					</ToastBar>
				)}
			</Toaster>
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
					<Route exact path="/dashboard/:content">
						<Dashboard />
					</Route>
					<Route exact path="/admin/:content">
						<AdminPanel />
					</Route>
					<Route>
						<div className="view">
							<h1 style={{ fontWeight: "bold", fontSize: "calc(4.5rem + 2vw)", letterSpacing: "10px" }}>
								404
							</h1>
							<span style={{ fontSize: "calc(1.3rem + 1vw)" }}>Page not found</span>
							<Link className="btn-cool" to="/" style={{ fontSize: "1.15rem", marginTop: "1rem" }}>
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
