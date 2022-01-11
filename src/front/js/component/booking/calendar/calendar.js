import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../../store/appContext";
import { Day } from "./day";
import dates from "../../../dates.json";
import "../../../../styles/components/calendar.scss";

export const Calendar = () => {
	const { store, actions } = useContext(Context);
	let [weeks, setWeeks] = useState(null); // sirve para renderizar las 6 semanas con sus días
	let [mouseEffect, setMouseEffect] = useState({
		X: -900,
		Y: -900
	});

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
			// Obtengo el primer Lunes del mes anterior que sacaré por pantalla, ejemplo: si el mes empieza en martes, cojo el 31 del mes anterior que será el primer lunes:
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
								// Compruebo si el día pertenece a otro mes para que al hacer click sobre él te lleve a ese mes
								(date.getFullYear() > todayYear || date.getMonth() > todayMonth) && i > calendar.totDays
									? calendar.month + 1
									: i <= 0 &&
									  ((date.getMonth() >= todayMonth && date.getFullYear() === todayYear) ||
											date.getFullYear() > todayYear)
										? calendar.month - 1
										: undefined
							}
							isToday={
								// comprobamos si se trata del día de hoy, fue dificil hacer está comparación, en internet proponen date.getTime() == date2.getTime() pero no me funcionó...
								JSON.stringify([date.getDate(), date.getMonth(), date.getFullYear()]) ===
								JSON.stringify([todayDay, todayMonth, todayYear])
									? true
									: false
							}
							isPast={
								// comprobamos si es un día del pasado para darle la clase .disabled
								date.getTime() < new Date(todayYear, todayMonth, todayDay).getTime() &&
								calendar.month === todayMonth
									? true
									: false
							}
							isDisabled={
								!store.dispo.map(element => element.date).includes(date.toLocaleDateString())
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
		[store.calendar.month] // realizo este useEffect() cada vez que cambia el mes
	);

	// Mouse Effect
	useEffect(() => {
		if (!document.querySelector(".month")) return;

		let mouseEffectFunc = event => {
			if (!document.querySelector(".month")) return;

			// Obtengo la posición del popup (X, Y)
			let container = document.querySelector(".month");
			let rect = container.getBoundingClientRect();

			setMouseEffect({
				X: event.clientX - rect.left,
				Y: event.clientY - rect.top
			});
		};
		// Añado el efecto al mouse
		if (window.innerWidth > 767.9) document.body.addEventListener("mousemove", mouseEffectFunc);

		const handleCalendarResize = () => {
			if (window.innerWidth <= 767.9) {
				document.body.removeEventListener("mousemove", mouseEffectFunc);
				if (document.querySelector(".month-blur-effect"))
					// Ojito! el event listener se quedará, ya que no existe el removeEventListener (habrá que implementarlo digo yo)
					document.querySelector(".month-blur-effect").style.display = "none";
			} else {
				document.body.addEventListener("mousemove", mouseEffectFunc);
				if (document.querySelector(".month-blur-effect"))
					document.querySelector(".month-blur-effect").style.display = "block";
			}
		};
		window.addEventListener("resize", handleCalendarResize);

		// Cuando se cierre el componente, removemos los eventListeners:
		return () => {
			window.removeEventListener("resize", handleCalendarResize);
			document.body.removeEventListener("mousemove", mouseEffectFunc);
		};
	}, []);

	return (
		<div className="calendar-wrapper">
			<div className="calendar-header">
				{/* Estos son los botones de cambio de mes, tienen position: absolute para colocarlos donde quiera */}
				<button
					className="previous-month"
					onClick={() => {
						if (calendar.month > todayMonth || calendar.year > todayYear) {
							actions.calendarActions.updateCalendar(calendar.month - 1);
						}
					}}>
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
				<div className="month">
					{weeks}
					<div
						className="month-blur-effect"
						style={{ left: `${mouseEffect.X}px`, top: `${mouseEffect.Y}px` }}
					/>
				</div>

				<div className="hours-avaliable">
					{store.dispo.map((item, index) => {
						if (item.date == store.booking_day) {
							return (
								<button
									className="btn btn-success p-2 m-2"
									key={index}
									onClick={() => {
										store.user.id
											? (actions.setPopup("resume", "Resumen de su reserva"),
											  actions.booking(item))
											: actions.setPopup("login", "Iniciar Sesión");
									}}>
									{item.time}
								</button>
							);
						}
					})}
				</div>
			</div>
		</div>
	);
};
