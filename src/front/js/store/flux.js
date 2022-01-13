import toast from "react-hot-toast";
import React from "react";
import { Redirect } from "react-router-dom";

const getNumOfDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: "",
			//resume_view muestra el resumen de la reserva
			resume_view: false,
			// creamos booking_day para pasar el día seleccionado para reservar
			booking_day: null,
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

			new_product: {},
			products: [],
			// oneProduct: [],

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

			socialMedia: {
				facebook: "https://facebook.com/spa-center",
				instagram: "https://instagram.com/spa-center",
				twitter: "https://twitter.com/spa-center"
			}
		},

		actions: {
			//BOOKING
			booking: data => {
				let store = getStore();
				setStore({ booking: data });
			},
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

			// Cambia el popups
			setPopup: async (type, title, productName, funct = null) => {
				if (productName) {
					//si recibe productname entonces busca la disponibilidad de días y horas de ese producto
					await fetch(process.env.BACKEND_URL + `/dispo/${productName}`)
						.then(response => {
							// console.log(response.ok);
							// console.log(response.status);
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
				if (funct) setStore({ popupFunct: funct });
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
				//cambia la variable del store booking_day
				changeHoursView: day => {
					const store = getStore();
					//cambiamos la variable booking_day con el día seleccionado para reservar
					setStore({ booking_day: day });
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

			//get all products
			get_products: async () => {
				await fetch(process.env.BACKEND_URL + "/products")
					.then(response => response.json())
					.then(data => setStore({ products: data }))
					.catch(error => console.error(error));
			},

			// create a product
			addProduct: async data => {
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
					const response = await fetch(process.env.BACKEND_URL + "/products", options);
					const resp = await response.json();
					if (!response.ok) {
						setStore({ message: resp.message });
						throw Error(response);
					}
					setStore({
						products: [...store.products, resp],
						new_product: resp
					});
					actions.closePopup();
					return resp;
				} catch (err) {
					return err.json();
				}
			},

			resetNewProduct: () => setStore({ new_product: {} }),

			// eliminar producto
			removeProduct: async id => {
				const actions = getActions();
				const store = getStore();
				try {
					const response = await fetch(process.env.BACKEND_URL + `/products/${id}`, {
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
					let remainProducts = store.products.filter(element => element.id !== id);
					setStore({
						products: remainProducts
					});
					actions.resetNewProduct();
					actions.closePopup();
					return resp;
				} catch (err) {
					return err.json();
				}
			},

			//Change ONE product
			updateProduct: async data => {
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
					const response = await fetch(process.env.BACKEND_URL + `/products/${data.id}`, options);
					const resp = await response.json();
					if (!response.ok) {
						setStore({ message: resp.message });
						throw Error(response);
					}
					let storeAux = store.products.filter(element => element.id !== data.id);
					setStore({
						products: [
							...storeAux,
							{
								id: resp.id,
								name: resp.name,
								price: resp.price,
								description: resp.description,
								duration: resp.duration
							}
						]
					});
					return resp;
				} catch (err) {
					return err.json();
				}
				// toast.promise(fetchFunction(data), {
				// 	loading: "Guardando...",
				// 	success: "Guardado correctamente",
				// 	error: () => `Error: ${store.message !== "" ? store.message : "desconocido"}`
				// });
			},

			// get ONE product
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
				//genera el token cuando haces login
				await fetch(process.env.BACKEND_URL + "/token", {
					method: "POST",
					body: JSON.stringify({ email: email, password: password }),
					headers: {
						"Content-type": "application/json"
					}
				})
					.then(response => {
						// console.log(response.ok);
						// console.log(response.status);
						return response.json();
					})
					.then(resp => {
						setStore({
							token: resp.token,
							message: resp.message
						});
						actions.getProfileData(resp.token);
						localStorage.setItem("token", resp.token);
					})
					.catch(error => console.error(error));
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

			// PASARELA DE PAGO DE PAGO DE STRIPE
			reservar: sku => {
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
							"https://3000-gold-felidae-8otxygdm.ws-eu25.gitpod.io/pago/" +
							`${store.booking.id}/${store.user.id}`,
						cancelUrl: "https://3000-gold-felidae-8otxygdm.ws-eu25.gitpod.io/error/"
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
			}
		}
	};
};

export default getState;
