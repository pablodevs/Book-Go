import toast from "react-hot-toast";

const getNumOfDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: {
				message: "",
				status: ""
			},
			resume_view: false,
			booking: {},

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

			token: null,
			user: {
				id: "",
				name: "",
				lastname: "",
				phone: "",
				email: "",
				profile_image_url: "",
				public_id: "",
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
			// STORE RESET
			reset: () => {
				const actions = getActions();
				const store = getStore();

				actions.calendarActions.setInitialCalendar();
				actions.resetNewService();
				actions.resetCloudinaryInfo();

				const cancel = store.cloudinaryInfo.image_url ? true : false;
				actions.closePopup(cancel);

				setStore({
					message: {
						message: "",
						status: ""
					},
					clients: [],
					widget: false,
					serviceInProgress: {},
					popupFunct: null,
					popupObj: {}
				});
			},

			// Force render without change data
			forceRender: () => setStore({}),

			// Muestra o cierra el Widget de Cloudinary
			setWidget: bool => setStore({ widget: bool }),

			// Genera un toast
			setToast: (type, body, funct = null, classname = "") => {
				if (type === "danger") toast.error(body);
				else if (type === "success") toast.success(body);
				else if (type === "blank") toast(body);
				else if (type === "promise") {
					const store = getStore();
					toast.promise(
						funct,
						{
							loading: body.loading,
							success: body.success,
							error: () =>
								`Error: ${store.message.message !== "" ? store.message.message : "desconocido"}`
						},
						{
							duration: 4000,
							className: classname,
							icon: null
						}
					);
					setStore({
						message: {
							message: "",
							status: ""
						}
					});
				}
			},

			// Cambia los popups
			setPopup: async (type, title, obj = {}, funct = null) => {
				// Para abrir el popup del login, register, reservas...
				let store = getStore();
				setStore({
					message: {
						message: "",
						status: ""
					},
					prevPopup: [...store.prevPopup, { popup: store.popup, popupTitle: store.popupTitle }],
					popup: type,
					popupTitle: title
				});
				if (funct) setStore({ popupFunct: funct });
				if (Object.entries(obj).length !== 0) setStore({ popupObj: obj });
			},

			// cierra el popup de login, register y calendario
			closePopup: (cancel = false) => {
				const actions = getActions();
				const store = getStore();

				setStore({
					popup: null,
					popupTitle: "",
					booking: {},
					prevPopup: [],
					serviceInProgress: {},
					popupObj: {}
				});
				actions.setWidget(false);

				if (cancel && store.cloudinaryInfo.image_url)
					actions.cancelCloudinaryUpload(store.cloudinaryInfo.public_id);

				actions.resetCloudinaryInfo();
			},

			// Te lleva al popup anterior
			goToPrevPopup: () => {
				let store = getStore();
				let actions = getActions();
				if (!store.prevPopup[store.prevPopup.length - 1].popup) {
					setStore({
						popupTitle: "",
						prevPopup: []
					});
					actions.closePopup(true);
					return;
				} else
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
				const actions = getActions();

				const stripe = Stripe("pk_test_yHT02IrsuQ0eWhAT2BBbfxmR");
				stripe
					.redirectToCheckout({
						lineItems: [{ price: sku, quantity: 1 }],
						mode: "payment",
						successUrl: `${process.env.FRONTEND_URL}/pago/${store.user.id}`,
						cancelUrl: process.env.FRONTEND_URL
					})
					.then(function(result) {
						if (result.error) actions.setToast("danger", result.error.message);
					});
			},

			// Meto todas las acciones del componente calendario en calendarActions:
			calendarActions: {
				// pide al back las horas disponibles para el servicio que se está reservando
				renderHoursDispo: async date => {
					const store = getStore();
					try {
						const response = await fetch(
							process.env.BACKEND_URL + `/services/${store.booking.service.id}/hours`,
							{
								method: "POST",
								headers: {
									"Content-type": "application/json"
								},
								body: JSON.stringify({
									date: date
								})
							}
						);
						const resp = await response.json();
						if (!response.ok) {
							setStore({
								message: {
									message: resp.message,
									status: ""
								}
							});
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
				// inicia el calendario
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

			// get all services
			get_services: async () => {
				await fetch(process.env.BACKEND_URL + "/services")
					.then(response => response.json())
					.then(data => setStore({ services: data }))
					.catch(error => console.error(error));
			},

			// start creating a service
			updateServiceInProgress: data => {
				const store = getStore();
				setStore({
					serviceInProgress: {
						...store.serviceInProgress,
						...data
					}
				});
			},

			// send new service to back
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
						setStore({
							message: {
								message: resp.message,
								status: ""
							}
						});
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
						setStore({
							message: {
								message: resp.message,
								status: ""
							}
						});
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
				const actions = getActions();
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
						setStore({
							message: {
								message: resp.message,
								status: ""
							}
						});
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
								sku: resp.sku,
								service_img_url: resp.service_img_url,
								public_id: resp.public_id
							}
						],
						new_service: resp
					});
					if (store.popup) actions.closePopup();
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
			createUser: async formData => {
				const actions = getActions();
				try {
					const response = await fetch(process.env.BACKEND_URL + `/user`, {
						method: "POST",
						body: formData
					});
					const resp = await response.json();
					if (!response.ok) {
						setStore({
							message: {
								message: resp.message,
								status: "danger"
							}
						});
						throw Error(response);
					}
					actions.setPopup("login", "Iniciar Sesión");
					setStore({
						message: {
							message: "Usuario creado Correctamente. Ya puede acceder!",
							status: "success"
						}
					});
					return resp;
				} catch (err) {
					console.error(err);
				}
			},

			// Update current USER
			updateUser: async formData => {
				const store = getStore();
				const actions = getActions();
				try {
					const response = await fetch(process.env.BACKEND_URL + "/user", {
						method: "PUT",
						body: formData,
						headers: {
							Authorization: "Bearer " + store.token
						}
					});
					const resp = await response.json();
					if (!response.ok) {
						setStore({
							message: {
								message: resp.message,
								status: "danger"
							}
						});
						throw Error(response);
					}
					setStore({
						user: {
							...store.user,
							name: resp.name,
							lastname: resp.lastname,
							phone: resp.phone,
							email: resp.email,
							img_url: resp.profile_image_url,
							public_id: resp.public_id
						}
					});
					if (store.popup) actions.closePopup();
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
						setStore({
							message: {
								message: resp.message,
								status: "danger"
							}
						});
						throw Error(response);
					}
					actions.logout();
					actions.closePopup();
					return resp;
				} catch (err) {
					return err.json();
				}
			},

			// LOGIN
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
						setStore({
							message: {
								message: resp.message,
								status: "danger"
							}
						});
						throw Error(response);
					} else {
						setStore({ token: resp.token });
						localStorage.setItem("token", resp.token);
						actions.getProfileData(resp.token);
						actions.setToast("blank", `Bienvenido ${resp.name}`);
						return resp;
					}
				} catch (err) {
					return console.error(err);
				}
			},

			// LOGOUT y elimina el localestore
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
					message: {
						message: "",
						status: ""
					}
				});
			},

			// Obtener la información del usuario en Dashboard (por ejemplo)
			getProfileData: async token => {
				const actions = getActions();
				const store = getStore();
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
						setStore({
							message: {
								message: resp.message,
								status: "danger"
							}
						});
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
							public_id: resp.public_id,
							is_admin: resp.is_admin
						}
					});
					if (!store.booking.date) actions.closePopup();
					else actions.setPopup("resume", "Resumen de su reserva"); // Incluir en el resumen la hora a la que finaliza y datos del usuario!
					return resp;
				} catch (error) {
					return error.json();
				}
			},

			// Cloudinary widget
			saveCloudinaryInfo: (url, public_id) =>
				setStore({
					cloudinaryInfo: {
						image_url: url,
						public_id: public_id
					}
				}),

			// Reset image_url
			resetCloudinaryInfo: () =>
				setStore({
					cloudinaryInfo: {
						image_url: null,
						public_id: null
					}
				}),

			// Cancel image Cloudinary upload
			cancelCloudinaryUpload: async public_id => {
				const actions = getActions();
				try {
					const response = await fetch(process.env.BACKEND_URL + "/cancel", {
						method: "PUT",
						body: JSON.stringify({ public_id: public_id }),
						headers: {
							"Content-Type": "application/json"
						}
					});
					const resp = await response.json();
					if (!response.ok) {
						setStore({
							message: {
								message: resp.message,
								status: ""
							}
						});
						throw Error(response);
					} else actions.setToast("blank", "Cancelado");
					return resp;
				} catch (err) {
					console.error(err);
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
						setStore({
							message: {
								message: resp.message,
								status: "danger"
							}
						});
						throw Error(response);
					}
					setStore({
						business: {
							id: resp.id,
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
						setStore({
							message: {
								message: resp.message,
								status: "danger"
							}
						});
						throw Error(response);
					}
					setStore({
						business: {
							id: resp.id,
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
			},

			// Desde el dashboard puedes cancelar una cita
			cancelBooking: async id => {
				const actions = getActions();
				const store = getStore();
				try {
					const response = await fetch(process.env.BACKEND_URL + `/book/${id}`, {
						method: "PUT",
						headers: {
							Authorization: "Bearer " + store.token
						}
					});
					const resp = await response.json();
					if (!response.ok) {
						setStore({
							message: {
								message: resp.message,
								status: ""
							}
						});
						throw Error(response);
					} else {
						actions.closePopup();
						return resp;
					}
				} catch (err) {
					return err.json();
				}
			}
		}
	};
};

export default getState;
