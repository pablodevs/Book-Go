import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../store/appContext.js";
import dates from "../../dates.json";
import { Day } from "./day";
import "../../../styles/components/calendar.scss";

// Obtengo la fecha actual para dar valores iniciales a los hooks:
let today = new Date();
let todayMonth = today.getMonth();
let todayYear = today.getFullYear();

export const Calendar = () => {
	const { store, actions } = useContext(Context);
	const [weeks, setWeeks] = useState(null); // sirve para renderizar las 6 semanas con sus días

	useEffect(
		() => {
			let weeksArray = [];

			// Compruebo en qué día cae el primer día del mes:
			let fisrtDay = new Date(store.calendar.year, store.calendar.month, 1);
			let fisrtDayWeekNum = fisrtDay.getDay();

			// Compruebo en qué día cae el último día del mes:
			let lastDay = new Date(store.calendar.year, store.calendar.month + 1, 0);
			let lastDayWeekNum = lastDay.getDay();

			// Empiezo a contar desde el Lunes y acabo en Domingo siempre:
			let firstMonday = 2 - fisrtDayWeekNum;
			if (fisrtDayWeekNum === 0) firstMonday = -5; // Domingo tiene el indice 0 así que es una excepción
			let lastSunday = store.calendar.totDays + (7 - lastDayWeekNum);
			if (lastDayWeekNum === 0) lastSunday = store.calendar.totDays; // Domingo tiene el indice 0 así que es una excepción

			let totDaysToShow = lastSunday - firstMonday + 1; // Esto me devuelve el número de días que apareceran en pantalla
			if (totDaysToShow !== 42) lastSunday += 7;
			if (totDaysToShow !== 42) lastSunday += 7; // Esta línea evita que un Febrero que tiene 28 días y empieza en Lunes de problemas jajajaja

			for (let i = 0; i < 6; i++) {
				let week = [];
				for (let i = firstMonday; i < firstMonday + 7; i++) {
					// recorro el bucle desde el primer Lunes hasta el último domingo semana por semana (o sea, de 7 en 7)
					let date = new Date(store.calendar.year, store.calendar.month, i);
					week.push(
						<Day
							key={i}
							date={date}
							isOnClickday={
								i > store.calendar.totDays
									? true
									: i <= 0 && date.getMonth() !== todayMonth
										? false
										: undefined
							}
							isLight={
								i <= 0 ||
								i > store.calendar.totDays ||
								(date.getMonth() === todayMonth && date.getDate() < today.getDate())
									? true
									: false
							} // comprobamos si el día pertenece al mes, si no, saldrá en gris claro
							isToday={
								JSON.stringify([date.getDate(), date.getMonth(), date.getFullYear()]) ===
								JSON.stringify([today.getDate(), todayMonth, todayYear]) // comprobamos si se trata del día de hoy, fue dificil hacer está comparación, en internet proponen date.getTime() == date2.getTime() pero no me funcionó...
									? true
									: false
							}
						/>
					);
				}
				firstMonday += 7; // actualizo el Lunes cada 7 días
				weeksArray.push(
					<div key={i} className="week">
						{week}
					</div>
				);
			}
			setWeeks(weeksArray); // cargo las semanas en pantalla
		},
		[store.calendar.month] // realizo este useEffect() cada vez que cambia el mes
	);

	return (
		<div className="view">
			{/* Todo lo meto dentro de una condición con ' : null' para que no se vea feo mientras carga, podéis probar a quitarlo y ver qué pasa. */}
			{weeks ? (
				<div className="calendar-wrapper">
					<h4 className="calendar-title">
						{dates["month_text"][store.calendar.month].toUpperCase()} {store.calendar.year}
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
							{/* Estos son los botones de cambio de mes, tienen position: absolute para colocarlos donde quiera */}
							{store.calendar.month === todayMonth ? null : (
								<button
									className="previous-month"
									onClick={() => actions.calendarActions.updateCalendar(false)}>
									<i className="fas fa-chevron-left" />
								</button>
							)}
							<button className="next-month" onClick={() => actions.calendarActions.updateCalendar(true)}>
								<i className="fas fa-chevron-right" />
							</button>
							{/* Aquí cargo el mes entero: */}
							<div className="month">{weeks}</div>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};
