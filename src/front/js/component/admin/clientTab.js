import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext";
import PropTypes from "prop-types";

export const ClientTab = props => {
	const { actions, store } = useContext(Context);
	const [focus, setFocus] = useState(false);
	const [active, setActive] = useState(false);

	return (
		<li className="li-client">
			<div
				className={
					"curved-corner-top" +
					(focus || store.activeClientTab === props.client.id ? " show-curved-corner" : "")
				}
			/>
			<div
				className={
					"curved-corner-bottom" +
					(focus || store.activeClientTab === props.client.id ? " show-curved-corner" : "")
				}
			/>
			<button
				className={
					"client-tab" + (focus || store.activeClientTab === props.client.id ? " client-tab-active" : "")
				}
				onClick={() => {
					actions.setActiveClientTab(props.client.id);
					props.sendClientInfo(props.client);
				}}
				onMouseEnter={() => setFocus(true)}
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
				onMouseLeave={() => setFocus(false)}>
				{props.client.profile_image_url ? (
					<img
						className="_navbar-profile-img client-tab-img"
						src={props.client.profile_image_url}
						width="35"
						height="35"
					/>
				) : (
					<div className="avatar avatar-miniature">
						<svg viewBox="0 0 24 24" className="avatar__img">
							<path
								d="M12,3.5c2.347,0,4.25,1.903,4.25,4.25S14.347,12,12,12s-4.25-1.903-4.25-4.25S9.653,3.5,12,3.5z
                    M5,20.5
                    c0-3.866,3.134-7,7-7s7,3.134,7,7H5z"
							/>
						</svg>
					</div>
				)}
				<span className="client-tab-name">
					{props.client.name} {props.client.lastname}
				</span>
			</button>
		</li>
	);
};

ClientTab.propTypes = {
	client: PropTypes.object,
	sendClientInfo: PropTypes.func
};
