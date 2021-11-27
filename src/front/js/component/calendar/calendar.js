import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../store/appContext.js"
import dates from "../../dates.json";
import { Day } from "./day";
import "../../../styles/components/calendar.scss";

const getMonthDays = (year, month) => {
	/*
		Esta función la creo para no repetir código todo el rato
		básicamente le das el año y el mes y te devuelve cuántos
		días tiene dicho mes. Esto lo consigues pasando el día 0
		del siguiente mes. Ejemplo: si se trata del día 0 de Febrero
		te devolvería el día 31 de Enero. Si le pides el día -1 de Febrero
		te devuelve el día 30 de Enero. 
	*/
	return new Date(year, month + 1, 0).getDate();
};

// Obtengo la fecha actual para dar valores iniciales a los hooks:
let today = new Date();
let todayMonth = today.getMonth();
let todayYear = today.getFullYear();

export const Calendar = () => {
	const {store, actions} = useContext(Context);

	const [weeks, setWeeks] = useState(null); // sirve para renderizar las 6 semanas con sus días
	const [month, setMonth] = useState(dates["month_text"][store.month].toUpperCase()); // sirve para cambiar el mes cuando el usuario clicke en las flechas
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
				for (let i = firstMonday; i < firstMonday + 7; i++) {
					// recorro el bucle desde el primer Lunes hasta el último domingo semana por semana (o sea, de 7 en 7)
					let date = new Date(year, dates["month_text"].indexOf(month.toLowerCase()), i);
					week.push(
						<Day
							key={i}
							date={date}
							isLight={
								i <= 0 ||
								i > totDays ||
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
		[month] // realizo este useEffect() cada vez que cambia el mes
	);

	return (
		<div className="view">
			{/* Todo lo meto dentro de una condición con ' : null' para que no se vea feo mientras carga, podéis probar a quitarlo y ver qué pasa. */}
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
							{/* Estos son los botones de cambio de mes, tienen position: absolute para colocarlos donde quiera */}
							{dates["month_text"].indexOf(month.toLowerCase()) === todayMonth ? null : (
								<button className="previous-month" onClick={() => upgradeMonth(false)}>
									<i className="fas fa-chevron-left" />
								</button>
							)}
							<button className="next-month" onClick={() => upgradeMonth(true)}>
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
