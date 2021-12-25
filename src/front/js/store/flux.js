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
			prevPopup: [],

			products: [],
			oneProduct: [],
			message: "",
			user: {
				token: null,
				id: null,
				name: null,
				lastname: null,
				phone: null,
				email: null,
				img_url: null,
				is_admin: false
			},
			socialMedia: {
				facebook: "https://facebook.com/spa-center",
				instagram: "https://instagram.com/spa-center",
				twitter: "https://twitter.com/spa-center"
			}
		},

		actions: {
			// Force render without change data
			forceRender: () => setStore({}),

			// Cambia el popups
			setPopup: async (type, title, productName) => {
				if (productName) {
					//si recibe productname entonces busca la disponibilidad de días y horas de ese producto
					await fetch(process.env.BACKEND_URL + `/dispo/${productName}`)
						.then(response => {
							console.log(response.ok);
							console.log(response.status);
							return response.json();
						})
						.then(data => {
							setStore({ dispo: data });
						})
						.catch(error => console.error(error));
				}
				// Para abrir el popup del login, register o reservas
				let store = getStore();
				setStore({
					prevPopup: [...store.prevPopup, { popup: store.popup, popupTitle: store.popupTitle }],
					popup: type,
					popupTitle: title
				});
			},
			closePopup: () =>
				setStore({
					popup: null,
					popupTitle: "",
					prevPopup: []
				}), // cierra el popup de login, register y calendario
			goToPrevPopup: () => {
				let store = getStore();
				setStore({
					popup: store.prevPopup[store.prevPopup.length - 1].popup,
					popupTitle: store.prevPopup[store.prevPopup.length - 1].popupTitle,
					prevPopup: [...store.prevPopup.slice(0, store.prevPopup.length - 1)]
				});
			}, // Te lleva al popup anterior

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

			// create a product
			addProduct: async data => {
				const options = {
					method: "POST",
					headers: {
						"Content-type": "application/json"
					},
					body: JSON.stringify(data)
				};
				const response = await fetch(process.env.BACKEND_URL + "/products", options);
				const resp = await response.json();
				if (response.status === 401) return false;
				return resp;
			},

			//get ONE product
			// getProduct: async id => {
			// 	await fetch(process.env.BACKEND_URL + `/products/${id}`)
			// 		.then(response => {
			// 			console.log(response.ok);
			// 			console.log(response.status);
			// 			return response.json();
			// 		})
			// 		.then(data => {
			// 			console.log(data);
			// 			setStore({ oneProduct: data });
			// 		})
			// 		.catch(error => console.error(error));
			// },

			//Change ONE product
			updateProduct: data => {
				let store = getStore();
				fetch(process.env.BACKEND_URL + `/products/${data.id}`, {
					method: "PUT",
					body: JSON.stringify(data),
					headers: {
						"Content-Type": "application/json"
					}
				})
					.then(response => {
						return response.json();
					})
					.then(resp => {
						let storeAux = store.products.filter(element => element.id !== data.id);
						setStore({
							products: [
								...storeAux,
								{
									id: resp.id,
									name: resp.name,
									price: resp.price,
									description: resp.description
								}
							]
						});
					})
					.catch(error => console.error(error));
			},

			// eliminar producto
			removeProduct: id => {
				fetch(process.env.BACKEND_URL + `/products/${id}`, {
					method: "DELETE"
				})
					.then(response => {
						return response.json();
					})
					.then(msg => {
						let remainProducts = store.products.filter(element => element.id !== id);
						setStore({
							products: remainProducts
						});
					})
					.catch(error => console.error(error));
			},
			// Create NEW USER
			createUser: async (data, files) => {
				const actions = getActions();

				// we are about to send this to the backend.
				let body = new FormData();
				body.append("name", data.name);
				body.append("lastname", data.lastname);
				body.append("email", data.email);
				body.append("phone", data.phone);
				body.append("password", data.password);
				if (files !== null) {
					body.append("profile_image", files[0]);
				}
				const options = {
					method: "POST",
					body: body
				};
				const response = await fetch(process.env.BACKEND_URL + "/user", options);
				const resp = await response.json();
				if (response.status === 401) return false;
				actions.generate_token(data.email, data.password);
				return resp;
			},
			updateUser: data => {
				let store = getStore();
				fetch(process.env.BACKEND_URL + `/user/${store.user.id}`, {
					method: "PUT",
					body: JSON.stringify(data),
					headers: {
						"Content-Type": "application/json"
					}
				})
					.then(response => {
						return response.json();
					})
					.then(resp => {
						setStore({
							user: {
								...store.user,
								name: resp.name,
								lastname: resp.lastname,
								phone: resp.phone,
								email: resp.email,
								img_url: resp.profile_image_url
							}
						});
					})
					.catch(error => console.error(error));
			},

			// al pulsar el botón de salir cambia el token a null
			logout: () => setStore({ token: null }),

			generate_token: async (email, password) => {
				const actions = getActions();
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
					.then(resp => {
						setStore({
							user: {
								token: resp.token,
								id: resp.id,
								name: resp.name,
								lastname: resp.lastname,
								phone: resp.phone,
								email: resp.email,
								img_url: resp.profile_image_url,
								is_admin: resp.is_admin
							},
							message: resp.message
						});
						actions.closePopup();
					})
					.catch(error => console.error(error));
			},
			logout: () => {
				// al pulsar el botón de salir cambia el token a null
				setStore({
					user: {
						token: null,
						id: null,
						name: null,
						lastname: null,
						phone: null,
						email: null,
						img_url: null,
						is_admin: false
					},
					message: ""
				});
			},
			updateSocialMedia: data =>
				setStore({
					socialMedia: {
						facebook: data.facebook,
						instagram: data.instagram,
						twitter: data.twitter
					}
				})
		}
	};
};

export default getState;
