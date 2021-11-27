import dates from "../dates.json";

const getNumOfDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			calendar: {
				date: null,
				day: null,
				month: null,
				year: null,
				totDays: null
			}
		},
		actions: {
			// Meto todas las acciones del componente calendario en calendarActions:
			calendarActions: {
				setInitialCalendar: () => {
					// Inicializa el calendario con la fecha actual al cargar la página
					let today = new Date();
					setStore({
						calendar: {
							date: today,
							day: today.getDate(),
							month: today.getMonth(),
							year: today.getFullYear(),
							totDays: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
						}
					});
				},
				updateCalendar: isNext => {
					/*
						Esta función recibe los onClick de los botones que cambian de mes
						o de los días de otros meses que aparecen en gris.
						Así, si recibe isNext = true, cambia los hooks al siguiente mes.
						Tuve que añadir excepciones por si estás en Diciembre y quieres ir a
						Enero del año que viene y lo contrario.
					*/
					let store = getStore();

					let currentMonthIndex = store.calendar.month;
					if (isNext) {
						if (currentMonthIndex == 11) {
							let newYear = store.calendar.year + 1;
							setStore({
								calendar: {
									...store.calendar,
									month: 0,
									totDays: getNumOfDaysInMonth(newYear, 0),
									year: newYear
								}
							});
						} else {
							let newMonth = currentMonthIndex + 1;
							setStore({
								calendar: {
									...store.calendar,
									month: newMonth,
									totDays: getNumOfDaysInMonth(store.calendar.year, newMonth)
								}
							});
						}
					} else {
						if (currentMonthIndex == 0) {
							let newYear = store.calendar.year - 1;
							setStore({
								calendar: {
									...store.calendar,
									month: 11,
									totDays: getNumOfDaysInMonth(newYear, 11),
									year: newYear
								}
							});
						} else {
							let newMonth = currentMonthIndex - 1;
							setStore({
								calendar: {
									...store.calendar,
									month: newMonth,
									totDays: getNumOfDaysInMonth(store.calendar.year, newMonth)
								}
							});
						}
					}
				}
			}
		}
	};
};

export default getState;
