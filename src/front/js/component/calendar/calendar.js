import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../store/appContext.js";
import dates from "../../dates.json";
import { Day } from "./day";
import "../../../styles/components/calendar.scss";

export const Calendar = () => {
	const { store, actions } = useContext(Context);
	const [weeks, setWeeks] = useState(null); // sirve para renderizar las 6 semanas con sus días

	let calendar = store.calendar,
		todayDate = calendar.todayDate,
		todayDay = todayDate.getDate(),
		todayMonth = todayDate.getMonth(),
		todayYear = todayDate.getFullYear();

	useEffect(
		() => {
			let weeksArray = [];
			if (calendar.month === null) return;

			// Compruebo en qué día cae el primer día del mes:
			let fisrtDayOfMonth = new Date(calendar.year, calendar.month, 1);
			// Obtengo el primer Lunes del mes anterior:
			let monday = 2 - fisrtDayOfMonth.getDay(); // date.getDay() --> 0(sunday) - 6(monday)
			if (fisrtDayOfMonth.getDay() === 0) monday = -5; // Domingo tiene el indice 0 así que es una excepción

			for (let i = 0; i < 6; i++) {
				let week = [];
				for (let i = monday; i < monday + 7; i++) {
					// recorro el bucle desde el primer Lunes hasta el último domingo semana por semana (o sea, de 7 en 7)
					let date = new Date(calendar.year, calendar.month, i);

					week.push(
						<Day
							key={i}
							date={date}
							isChangeMonthDay={
								(date.getFullYear() > todayYear || date.getMonth() > todayMonth) && i > calendar.totDays
									? calendar.month + 1
									: i <= 0 &&
									  ((date.getMonth() >= todayMonth && date.getFullYear() === todayYear) ||
											date.getFullYear() > todayYear)
										? calendar.month - 1
										: undefined
							}
							isToday={
								JSON.stringify([date.getDate(), date.getMonth(), date.getFullYear()]) ===
								JSON.stringify([todayDay, todayMonth, todayYear]) // comprobamos si se trata del día de hoy, fue dificil hacer está comparación, en internet proponen date.getTime() == date2.getTime() pero no me funcionó...
									? true
									: false
							}
							isPast={
								date.getTime() < new Date(todayYear, todayMonth, todayDay).getTime() &&
								calendar.month === todayMonth
									? true
									: false
							}
						/>
					);
				}
				monday += 7; // actualizo el Lunes cada 7 días
				weeksArray.push(
					<div key={i} className="week">
						{week}
					</div>
				);
			}
			setWeeks(weeksArray); // cargo las semanas en pantalla
		},
		[store.calendar] // realizo este useEffect() cada vez que cambia el mes
	);

	return (
		<div className="view">
			{/* Todo lo meto dentro de una condición con ' : null' para que no se vea feo mientras carga, podéis probar a quitarlo y ver qué pasa. */}
			{weeks ? (
				<div className="calendar-wrapper">
					<div className="calendar-header">
						{/* Estos son los botones de cambio de mes, tienen position: absolute para colocarlos donde quiera */}
						<button
							className="previous-month"
							onClick={
								calendar.month > todayMonth || calendar.year > todayYear
									? () => actions.calendarActions.updateCalendar(calendar.month - 1)
									: () => undefined
							}>
							<i className="fas fa-chevron-left" />
						</button>
						<h4 className="calendar-title">
							{dates["month_text"][calendar.month].toUpperCase()} {calendar.year}
						</h4>
						<button
							className="next-month"
							onClick={() => actions.calendarActions.updateCalendar(calendar.month + 1)}>
							<i className="fas fa-chevron-right" />
						</button>
					</div>
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
						{/* Aquí cargo el mes entero: */}
						<div className="month">{weeks}</div>
					</div>
				</div>
			) : null}
		</div>
	);
};
