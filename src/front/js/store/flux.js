import dates from "../dates.json";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			calendar: {
				date: new Date(),
				day: new Date().getDate(),
				month: new Date().getMonth(),
				year: new Date().getFullYear(),
				totDays: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
			}
		},
		actions: {
			// Meto todas las acciones del componente calendario en calendarActions:
			calendarActions: {
				updateCalendar: isNext => {
					/*
						Esta función recibe los onClick de los botones que cambian de mes
						o de los días de otros meses que aparecen en gris.
						Así, si recibe isNext = true, cambia los hooks al siguiente mes.
						Tuve que añadir excepciones por si estás en Diciembre y quieres ir a
						Enero del año que viene y lo contrario.
					*/
					calendar = getStore().calendar;

					let currentMonthIndex = dates["month_text"].indexOf(month.toLowerCase());
					if (isNext) {
						if (currentMonthIndex == 11) {
							setYear(year + 1);
							setTotDays(getMonthDays(year, 0));
							setMonth(dates["month_text"][0].toUpperCase());
						} else {
							setTotDays(getMonthDays(year, currentMonthIndex + 1));
							setMonth(dates["month_text"][currentMonthIndex + 1].toUpperCase());
						}
					} else {
						if (currentMonthIndex == 0) {
							setYear(year - 1);
							setTotDays(getMonthDays(year, 11));
							setMonth(dates["month_text"][11].toUpperCase());
						} else {
							setTotDays(getMonthDays(year, currentMonthIndex - 1));
							setMonth(dates["month_text"][currentMonthIndex - 1].toUpperCase());
						}
					}
				}
			}
		}
	};
};

export default getState;
