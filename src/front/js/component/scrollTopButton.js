import React from "react";
import "../../styles/components/scrollTopButton.scss";

export const ScrollTop = () => {
	function topFunction() {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	}

	return (
		<button id="scroll-top" onClick={topFunction}>
			<i className="fas fa-chevron-up" />
		</button>
	);
};
