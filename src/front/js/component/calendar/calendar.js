import React, { useState } from "react";
import "../../../styles/components/calendar.scss";
import dates from "../../dates.json";
import { Day } from "./day";

let today = new Date();

export const Calendar = () => {
	const [month, setMonth] = useState(dates["month_text"][today.getMonth()].toUpperCase());
	const [year, setYear] = useState(today.getUTCFullYear());

	const renderWeeks = () => {
		let weeks = [];
		let dayNumber = 1;
		for (let i = 0; i < 5; i++) {
			let week = [];
			for (let i = dayNumber; i < dayNumber + 7; i++) {
				week.push(<Day key={i} number={i} />);
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

	const upgradeMonth = isNext => {
		let currentMonthIndex = dates["month_text"].indexOf(month.toLowerCase());

		if (isNext) {
			if (currentMonthIndex == 11) {
				setMonth(dates["month_text"][0].toUpperCase());
				setYear(year + 1);
			} else setMonth(dates["month_text"][currentMonthIndex + 1].toUpperCase());
		} else {
			if (currentMonthIndex == 0) {
				setMonth(dates["month_text"][11].toUpperCase());
				setYear(year - 1);
			} else setMonth(dates["month_text"][currentMonthIndex - 1].toUpperCase());
		}
	};

	return (
		<div className="view my-auto">
			<h4 className="calendar-title">
				{month} {year}
			</h4>
			<div className="calendar-wrapper">
				<div className="calendar">
					<div className="week-days">
						{dates["day_text"]
							.slice(1, dates["day_text"].length)
							.concat(dates["day_text"].slice(0, 1))
							.map((dayname, idx) => (
								<div key={idx} className="center">
									{dayname}
								</div>
							))}
					</div>
					<div className="month-wrapper">
						<button className="previous-month" onClick={() => upgradeMonth(false)}>
							<i className="fas fa-chevron-left" />
						</button>
						<button className="next-month" onClick={() => upgradeMonth(true)}>
							<i className="fas fa-chevron-right" />
						</button>
						<div className="month">{renderWeeks()}</div>
					</div>
				</div>
			</div>
		</div>
	);
};
