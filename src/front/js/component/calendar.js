import React from "react";
import "../../styles/components/calendar.scss";

export const Calendar = () => {
	let weekDays = ["L", "M", "X", "J", "V", "S", "D"];

	const renderWeeks = () => {
		let weeks = [];
		let dayNumber = 1;
		for (let i = 0; i < 5; i++) {
			let week = [];
			for (let i = dayNumber; i < dayNumber + 7; i++) {
				week.push(
					<div key={i} className="center">
						{i}
					</div>
				);
			}
			dayNumber += 7;
			weeks.push(
				<div key={i} className="week">
					{week}
				</div>
			);
		}
		return weeks;
	};

	return (
		<div className="view my-auto">
			<div className="calendar-header">
				<button>
					<i className="fas fa-chevron-left" />
				</button>
				<h4 className="clendar-title">NOVIEMBRE 2021</h4>
				<button>
					<i className="fas fa-chevron-right" />
				</button>
			</div>
			<div className="calendar">
				<div className="week-days">
					{weekDays.map((day, idx) => (
						<div key={idx} className="center">
							{day}
						</div>
					))}
				</div>
				<div className="month">{renderWeeks()}</div>
			</div>
		</div>
	);
};
