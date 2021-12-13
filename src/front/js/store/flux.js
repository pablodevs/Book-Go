const getNumOfDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			calendar: {
				todayDate: new Date(),
				date: null,
				day: null,
				month: null,
				year: null,
				totDays: null
			},
			popup: null,
			popupTitle: "",
			products: [],
			oneProduct: [],
			message: "",
			token: null,
			user_id: null
		},

		actions: {
			logout: () => {
				// al pulsar el botón de salir cambia el token a null
				let store = getStore();
				setStore({ token: null });
			},
			setPopup: (type, title) => {
				//Hace que se abra el popup para el login, register o calendario de reservas
				let store = getStore();
				let actions = getActions();
				if (type === store.popup) actions.closePopup();
				else setStore({ popup: type, popupTitle: title });
			},

			closePopup: () => setStore({ popup: null }), // cierra el popup de login, register y calendario
			setPopupTitle: newTitle => setStore({ popupTitle: newTitle }),

			// Meto todas las acciones del componente calendario en calendarActions:
			calendarActions: {
				//inicia el calendario
				setInitialCalendar: () => {
					// Inicializa el calendario con la fecha actual al cargar la página
					let today = new Date();
					setStore({
						calendar: {
							todayDate: today,
							date: today,
							day: today.getDate(),
							month: today.getMonth(),
							year: today.getFullYear(),
							totDays: getNumOfDaysInMonth(today.getFullYear(), today.getMonth())
						}
					});
				},
				// actualiza el calendario
				updateCalendar: month => {
					/*
						Esta función recibe los onClick de los botones que cambian de mes
						o de los días de otros meses que aparecen en gris.
					*/
					let store = getStore();
					let year = store.calendar.year;

					if (month === 12) {
						month = 0;
						year += 1;
					} else if (month === -1) {
						month = 11;
						year -= 1;
					}

					setStore({
						calendar: {
							...store.calendar,
							date: null,
							day: null,
							month: month,
							year: year,
							totDays: getNumOfDaysInMonth(year, month)
						}
					});
				}
			},

			//get all products
			get_products: async () => {
				await fetch(process.env.BACKEND_URL + "/products")
					.then(response => {
						console.log(response.ok);
						console.log(response.status);
						return response.json();
					})
					.then(data => {
						setStore({ products: data });
					})
					.catch(error => console.error(error));
			},

			//get ONE product
			getProduct: async id => {
				await fetch(process.env.BACKEND_URL + `/products/${id}`)
					.then(response => {
						console.log(response.ok);
						console.log(response.status);
						return response.json();
					})
					.then(data => {
						console.log(data);
						setStore({ oneProduct: data });
					})
					.catch(error => console.error(error));
			},

			//Create NEW USER
			createUser: async data => {
				await fetch(process.env.BACKEND_URL + `/user`, {
					method: "POST",
					body: data
				})
					.then(response => {
						console.log(response.ok);
						console.log(response.status);
						return response.json();
					})
					.then(data => {
						console.log(data);
						setStore({ message: "Usuario creado Correctamente. Ya puede ir al login y acceder!" });
					})
					.catch(error => console.error(error));
			},

			generate_token: async (email, password) => {
				//genera el token cuando haces login
				await fetch(process.env.BACKEND_URL + `/token`, {
					method: "POST",
					body: JSON.stringify({ email: email, password: password }),
					headers: {
						"Content-Type": "application/json"
					}
				})
					.then(response => {
						console.log(response.ok);
						console.log(response.status);
						return response.json();
					})
					.then(data => {
						console.log(data);
						setStore({
							message: data.message,
							token: data.token,
							user_id: data.user_id,
							img_url: data.profile_image_url
						});
					})
					.catch(error => console.error(error));
			}
		}
	};
};

export default getState;
