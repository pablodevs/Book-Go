import React, { useEffect, useState } from "react";
import dates from "../../dates.json";
import { Day } from "./day";
import "../../../styles/components/calendar.scss";

const getMonthDays = (year, month) => {
	return new Date(year, month, 0).getDate();
};

let today = new Date();
let todayMonth = today.getMonth() + 1;
let todayYear = today.getFullYear();

export const Calendar = () => {
	const [weeks, setWeeks] = useState(null); // sirve para renderizar las 6 semanas con sus días
	const [month, setMonth] = useState(dates["month_text"][today.getMonth()].toUpperCase()); // sirve para cambiar el mes cuando el usuario clicke en las flechas
	const [totDays, setTotDays] = useState(getMonthDays(todayYear, todayMonth)); // Para saber en todo momento cuántos días tiene el mes ya que los hay de 30, 31 y 28 días.
	const [year, setYear] = useState(today.getFullYear());

	useEffect(
		() => {
			let weeksArray = [];

			// Compruebo en qué día cae el primer día del mes:
			let fisrtDay = new Date(year, dates["month_text"].indexOf(month.toLowerCase()), 1);
			let fisrtDayWeekNum = fisrtDay.getDay();

			// Compruebo en qué día cae el último día del mes:
			let lastDay = new Date(year, dates["month_text"].indexOf(month.toLowerCase()) + 1, 0);
			let lastDayWeekNum = lastDay.getDay();

			// Empiezo a contar desde el Lunes y acabo en Domingo siempre:
			let firstMonday = 2 - fisrtDayWeekNum;
			if (fisrtDayWeekNum === 0) firstMonday = -5; // Domingo tiene el indice 0 así que es una excepción
			let lastSunday = totDays + (7 - lastDayWeekNum);
			if (lastDayWeekNum === 0) lastSunday = totDays; // Domingo tiene el indice 0 así que es una excepción

			let totDaysToShow = lastSunday - firstMonday + 1; // Esto me devuelve el número de días que apareceran en pantalla
			if (totDaysToShow !== 42) lastSunday += 7;
			if (totDaysToShow !== 42) lastSunday += 7; // Esta línea evita que un Febrero que tiene 28 días y empieza en Lunes de problemas jajajaja

			for (let i = 0; i < 6; i++) {
				let week = [];
				for (let i = firstMonday; i < firstMonday + 7 && i <= lastSunday; i++) {
					let date = new Date(year, dates["month_text"].indexOf(month.toLowerCase()), i);
					week.push(
						<Day
							key={i}
							date={date}
							isLight={i <= 0 || i > totDays ? true : false}
							isToday={
								JSON.stringify([date.getDate(), date.getMonth() + 1, date.getFullYear()]) ==
								JSON.stringify([today.getDate(), todayMonth, todayYear])
									? true
									: false
							}
						/>
					);
				}
				firstMonday += 7;
				weeksArray.push(
					<div key={i} className="week">
						{week}
					</div>
				);
			}
			setWeeks(weeksArray);
		},
		[month]
	);

	const upgradeMonth = isNext => {
		let currentMonthIndex = dates["month_text"].indexOf(month.toLowerCase());

		if (isNext) {
			if (currentMonthIndex == 11) {
				setMonth(dates["month_text"][0].toUpperCase());
				setYear(year + 1);
				setTotDays(getMonthDays(year, 1));
			} else {
				setMonth(dates["month_text"][currentMonthIndex + 1].toUpperCase());
				setTotDays(getMonthDays(year, currentMonthIndex + 2));
			}
		} else {
			if (currentMonthIndex == 0) {
				setMonth(dates["month_text"][11].toUpperCase());
				setYear(year - 1);
				setTotDays(getMonthDays(year, 0));
			} else {
				setMonth(dates["month_text"][currentMonthIndex - 1].toUpperCase());
				setTotDays(getMonthDays(year, currentMonthIndex));
			}
		}
	};

	return (
		<div className="view">
			{weeks ? (
				<div className="calendar-wrapper">
					<h4 className="calendar-title">
						{month} {year}
					</h4>
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
							<div className="month">{weeks}</div>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};
