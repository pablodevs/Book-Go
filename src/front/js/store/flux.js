import toast from "react-hot-toast";

const getNumOfDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: "",
			//resume_view muestra el resumen de la reserva
			resume_view: false,
			// creamos booking_day para pasar el día seleccionado para reservar
			// booking_day: null,
			booking: {
				foo: "caca"
			},

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
			popupFunct: () => undefined,
			prevPopup: [],

			new_service: {},
			services: [],
			// oneService: [],

			token: null,
			user: {
				id: "",
				name: "",
				lastname: "",
				phone: "",
				email: "",
				img_url: "",
				is_admin: false
			},

			business: {
				id: "",
				address: "",
				phone: "",
				schedule: "",
				weekdays: [],
				fb_url: "",
				ig_url: "",
				twitter_url: ""
			}
		},

		actions: {
			// Force render without change data
			forceRender: () => setStore({}),

			// Genera un toast
			setToast: (type, message, funct = null, classname = "") => {
				if (type === "error") toast.error(message);
				else if (type === "success") toast.success(message);
				else if (type === "blank") toast(message);
				else if (type === "promise") {
					const store = getStore();
					toast.promise(
						funct,
						{
							loading: message.loading,
							success: message.success,
							error: () => `Error: ${store.message !== "" ? store.message : "desconocido"}`
						},
						{
							duration: 4000,
							className: classname,
							icon: null
						}
					);
					setStore({ message: "" });
				}
			},

			// Cambia los popups
			setPopup: async (type, title, funct = null) => {
				// if (serviceName) {
				// 	//si recibe servicename entonces busca la disponibilidad de días y horas de ese servicio
				// 	await fetch(process.env.BACKEND_URL + `/dispo/${serviceName}`)
				// 		.then(response => {
				// 			// console.log(response.ok);
				// 			// console.log(response.status);
				// 			return response.json();
				// 		})
				// 		.then(data => {
				// 			setStore({ dispo: data });
				// 		})
				// 		.catch(error => console.error(error));
				// }

				// Para abrir el popup del login, register o reservas
				let store = getStore();
				setStore({
					prevPopup: [...store.prevPopup, { popup: store.popup, popupTitle: store.popupTitle }],
					popup: type,
					popupTitle: title
				});
				if (funct) setStore({ popupFunct: funct });
			},

			// cierra el popup de login, register y calendario
			closePopup: () =>
				setStore({
					popup: null,
					popupTitle: "",
					prevPopup: []
				}),

			// Te lleva al popup anterior
			goToPrevPopup: () => {
				let store = getStore();
				setStore({
					popup: store.prevPopup[store.prevPopup.length - 1].popup,
					popupTitle: store.prevPopup[store.prevPopup.length - 1].popupTitle,
					prevPopup: [...store.prevPopup.slice(0, store.prevPopup.length - 1)]
				});
			},

			// Reset booking in store
			resetBooking: () => setStore({ booking: {} }),

			// Update booking in store
			updateBooking: (key, value) => {
				const store = getStore();
				let storeAux = store.booking;
				storeAux[key] = value;
				setStore({
					booking: {
						...storeAux
					}
				});
			},

			// PASARELA DE PAGO DE PAGO DE STRIPE
			book: sku => {
				const store = getStore();
				const stripe = Stripe("pk_test_yHT02IrsuQ0eWhAT2BBbfxmR");
				stripe
					.redirectToCheckout({
						lineItems: [{ price: sku, quantity: 1 }],
						mode: "payment",
						/*
				 * Do not rely on the redirect to the successUrl for fulfilling
				 * purchases, customers may not always reach the success_url after
				 * a successful payment.
				 * Instead use one of the strategies described in
				 * https://stripe.com/docs/payments/checkout/fulfill-orders
				 */
						successUrl:
							"https://3000-peibol888-inalroject-pz8kr8ye2xu.ws-eu27.gitpod.io/pago" +
							`${store.booking.service.id}/${store.user.id}`,
						cancelUrl: "https://3000-peibol888-inalroject-pz8kr8ye2xu.ws-eu27.gitpod.io/error/"
					})
					.then(function(result) {
						if (result.error) {
							/*
				   * If `redirectToCheckout` fails due to a browser or network
				   * error, display the localized error message to your customer.
				   */
							var displayError = document.getElementById("error-message");
							displayError.textContent = result.error.message;
						}
					});
			},

			// Meto todas las acciones del componente calendario en calendarActions:
			calendarActions: {
				// pide al back las horas disponibles para el servicio que se está reservando
				renderHoursDispo: async () => {
					const store = getStore();
					try {
						const response = await fetch(
							process.env.BACKEND_URL + `/services/${store.booking.service.id}/hours`
						);
						const resp = await response.json();
						if (!response.ok) {
							setStore({ message: resp.message });
							throw Error(response);
						}
						setStore({
							hoursDispo: resp
						});
						return resp;
					} catch (err) {
						console.error(err);
					}
				},
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

			//get all services
			get_services: async () => {
				await fetch(process.env.BACKEND_URL + "/services")
					.then(response => response.json())
					.then(data => setStore({ services: data }))
					.catch(error => console.error(error));
			},

			// create a service
			addService: async data => {
				const store = getStore();
				const actions = getActions();
				const options = {
					method: "POST",
					headers: {
						"Content-type": "application/json",
						Authorization: "Bearer " + store.token
					},
					body: JSON.stringify(data)
				};
				try {
					const response = await fetch(process.env.BACKEND_URL + "/services", options);
					const resp = await response.json();
					if (!response.ok) {
						setStore({ message: resp.message });
						throw Error(response);
					}
					setStore({
						services: [...store.services, resp],
						new_service: resp
					});
					actions.closePopup();
					return resp;
				} catch (err) {
					return err.json();
				}
			},

			resetNewService: () => setStore({ new_service: {} }),

			// eliminar servicio
			removeService: async id => {
				const actions = getActions();
				const store = getStore();
				try {
					const response = await fetch(process.env.BACKEND_URL + `/services/${id}`, {
						method: "DELETE",
						headers: {
							Authorization: "Bearer " + store.token
						}
					});
					const resp = await response.json();
					if (!response.ok) {
						setStore({ message: resp.message });
						throw Error(response);
					}
					let remainServices = store.services.filter(element => element.id !== id);
					setStore({
						services: remainServices
					});
					actions.resetNewService();
					actions.closePopup();
					return resp;
				} catch (err) {
					return err.json();
				}
			},

			// Change ONE service
			updateService: async data => {
				const store = getStore();
				const options = {
					method: "PUT",
					body: JSON.stringify(data),
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + store.token
					}
				};
				try {
					const response = await fetch(process.env.BACKEND_URL + `/services/${data.id}`, options);
					const resp = await response.json();
					if (!response.ok) {
						setStore({ message: resp.message });
						throw Error(response);
					}
					let storeAux = store.services.filter(element => element.id !== data.id);
					setStore({
						services: [
							...storeAux,
							{
								id: resp.id,
								name: resp.name,
								price: resp.price,
								description: resp.description,
								duration: resp.duration,
								is_active: resp.is_active,
								sku: resp.sku
							}
						]
					});
					return resp;
				} catch (err) {
					return err.json();
				}
			},

			// get ONE service
			// getService: async id => {
			// 	await fetch(process.env.BACKEND_URL + `/services/${id}`)
			// 		.then(response => {
			// 			console.log(response.ok);
			// 			console.log(response.status);
			// 			return response.json();
			// 		})
			// 		.then(data => {
			// 			console.log(data);
			// 			setStore({ oneService: data });
			// 		})
			// 		.catch(error => console.error(error));
			// },

			// Create NEW USER
			createUser: async (data, files) => {
				const actions = getActions();
				// // we are about to send this to the backend.
				// let body = new FormData();
				// body.append("name", data.name);
				// body.append("lastname", data.lastname);
				// body.append("email", data.email);
				// body.append("phone", data.phone);
				// body.append("password", data.password);
				// if (files !== null) {
				// 	body.append("profile_image", files[0]);
				// }
				const options = {
					method: "POST",
					headers: {
						"Content-type": "application/json"
					},
					body: JSON.stringify(data)
				};
				const response = await fetch(process.env.BACKEND_URL + "/users", options);
				const resp = await response.json();
				if (response.status === 401) return false;
				actions.generate_token(data.email, data.password);
				return resp;
			},

			// Update current USER
			updateUser: async data => {
				const store = getStore();
				try {
					const response = await fetch(process.env.BACKEND_URL + "/user", {
						method: "PUT",
						body: JSON.stringify(data),
						headers: {
							"Content-Type": "application/json",
							Authorization: "Bearer " + store.token
						}
					});
					const resp = await response.json();
					if (!response.ok) {
						setStore({ message: resp.message });
						throw Error(response);
					}
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
					return resp;
				} catch (err) {
					return err.json();
				}
			},

			// Delete current USER
			deleteUser: async () => {
				const actions = getActions();
				const store = getStore();
				try {
					const response = await fetch(process.env.BACKEND_URL + "/user", {
						method: "DELETE",
						headers: {
							Authorization: "Bearer " + store.token
						}
					});
					const resp = await response.json();
					if (!response.ok) {
						setStore({ message: resp.message });
						throw Error(response);
					}
					actions.logout();
					actions.closePopup();
					return resp;
				} catch (err) {
					return err.json();
				}
			},

			generate_token: async (email, password) => {
				const actions = getActions();
				try {
					const response = await fetch(process.env.BACKEND_URL + "/token", {
						method: "POST",
						body: JSON.stringify({ email: email, password: password }),
						headers: {
							"Content-type": "application/json"
						}
					});
					const resp = await response.json();
					if (!response.ok) {
						setStore({ message: resp.message });
						throw Error(response);
					} else {
						setStore({
							token: resp.token,
							message: resp.message
						});
						actions.getProfileData(resp.token);
						localStorage.setItem("token", resp.token);
						return resp;
					}
				} catch (err) {
					return console.error(err);
				}
			},

			logout: () => {
				// al pulsar el botón de salir cambia el token a null
				localStorage.removeItem("token");
				setStore({
					token: null,
					user: {
						id: "",
						name: "",
						lastname: "",
						phone: "",
						email: "",
						img_url: "",
						is_admin: false
					},
					message: ""
				});
			},

			// Obtener la información del usuario en Dashboard (por ejemplo)
			getProfileData: async token => {
				const actions = getActions();
				const options = {
					method: "GET",
					headers: {
						Authorization: "Bearer " + token
					}
				};
				try {
					const response = await fetch(process.env.BACKEND_URL + "/user", options);
					const resp = await response.json();
					if (response.status === 401) actions.logout();
					if (!response.ok) {
						setStore({ message: resp.message });
						throw Error(response);
					}
					setStore({
						user: {
							id: resp.id,
							name: resp.name,
							lastname: resp.lastname,
							phone: resp.phone,
							email: resp.email,
							img_url: resp.profile_image_url,
							is_admin: resp.is_admin
						}
					});
					return resp;
				} catch (error) {
					return error.json();
				}
			},

			// Obtener la lista de clientes
			getClients: async () => {
				const store = getStore();
				const response = await fetch(process.env.BACKEND_URL + "/users", {
					headers: {
						Authorization: "Bearer " + store.token
					}
				});
				if (response.status === 401) return false;
				const resp = await response.json();
				setStore({ clients: resp });
				return true;
			},

			setActiveClientTab: key => setStore({ activeClientTab: key }),

			// Redes sociales
			updateSocialMedia: data =>
				setStore({
					socialMedia: {
						facebook: data.facebook,
						instagram: data.instagram,
						twitter: data.twitter
					}
				}),

			// Admin Schedule:
			setActiveWeekDay: weekday => {
				const business = getStore().business;
				if (weekday === "all")
					setStore({
						business: {
							...business,
							weekdays: ["L", "M", "X", "J", "V", "S", "D"]
						}
					});
				else if (weekday === "L-V")
					setStore({
						business: {
							...business,
							weekdays: ["L", "M", "X", "J", "V"]
						}
					});
				else if (weekday === "0")
					setStore({
						business: {
							...business,
							weekdays: []
						}
					});
				else if (business.weekdays.includes(weekday)) {
					let remainWeekDays = business.weekdays.filter(element => element !== weekday);
					setStore({
						business: {
							...business,
							weekdays: remainWeekDays
						}
					});
				} else
					setStore({
						business: {
							...business,
							weekdays: [...business.weekdays, weekday]
						}
					});
			},

			// Obtiene los horarios, redes sociales, teléfono, etc
			getBusinessInfo: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/business");
					const resp = await response.json();
					if (!response.ok) {
						setStore({ message: resp.message });
						throw Error(response);
					}
					setStore({
						business: {
							id: resp.id,
							name: resp.name,
							address: resp.address,
							phone: resp.phone,
							schedule: resp.schedule,
							weekdays: resp.weekdays.split(","),
							fb_url: resp.fb_url,
							ig_url: resp.ig_url,
							twitter_url: resp.twitter_url
						}
					});
					return resp;
				} catch (err) {
					console.error(err);
				}
			},

			// Cambia horarios, redes sociales, teléfono, etc
			updateBusinessInfo: async data => {
				const store = getStore();
				try {
					const response = await fetch(process.env.BACKEND_URL + "/business", {
						method: "PUT",
						body: JSON.stringify(data),
						headers: {
							"Content-Type": "application/json",
							Authorization: "Bearer " + store.token
						}
					});
					const resp = await response.json();
					if (!response.ok) {
						setStore({ message: resp.message });
						throw Error(response);
					}
					setStore({
						business: {
							id: resp.id,
							name: resp.name,
							address: resp.address,
							phone: resp.phone,
							schedule: resp.schedule,
							weekdays: resp.weekdays.split(","),
							fb_url: resp.fb_url,
							ig_url: resp.ig_url,
							twitter_url: resp.twitter_url
						}
					});
					return resp;
				} catch (err) {
					return err.json();
				}
			}
		}
	};
};

export default getState;
