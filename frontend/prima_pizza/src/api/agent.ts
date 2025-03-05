// Default Imports
import axios, { AxiosResponse } from "axios";



const nodeEnv = process.env.NEXT_PUBLIC_NODE_ENV || "LOCAL"; 
let baseUrl = process.env.NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_DEV


console.log('Current environment:', nodeEnv);
console.log('DEV URL:', process.env.NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_DEV);
console.log('LOCAL URL:', process.env.NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_LOCAL);


const responseBody = <T>(response: AxiosResponse<T>) => response.data;

// Create axios instance with the correct baseURL
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  maxRedirects: 5,
  httpsAgent: true
});

// Helper for requests
const request = {
  get: (url: string, config?: { headers: { Authorization?: string; "Content-Type": string } }) =>
    axios.get(url, config).then(responseBody),

  post: (url: string, body: object, config?: { headers: { Authorization?: string; "Content-Type": string } }) =>
    axios.post(url, body, config).then(responseBody),

  put: (url: string, body: object, config?: { headers: { Authorization?: string; "Content-Type": string } }) =>
    axios.put(url, body, config).then(responseBody),

  delete: (url: string, config?: { headers: { Authorization?: string; "Content-Type": string } }) =>
    axios.delete(url, config).then(responseBody),
};

// Requests to API
const Requests = {
  login: (data: { username: string; password: string }): Promise<any> =>
    request.post(`${baseUrl}/api/v1/auth/login`, data, {
      headers: { "Content-Type": "application/json" }
    }),

  register: (data: { username: string; password: string; role: string }): Promise<any> =>
    request.post(`${baseUrl}/api/v1/auth/register`, data, {
      headers: { "Content-Type": "application/json" }
    }),

  getToppings: (): Promise<any> => request.get(`${baseUrl}/api/v1/toppings`),

  addTopping: (data: { name: string; price: number; topping_type: string }, token: string): Promise<any> =>
    request.post(`${baseUrl}/api/v1/toppings/`, data, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }),

  updateTopping: (name: string, data: { name?: string; price?: number; topping_type?: string }, token: string): Promise<any> =>
    request.put(`${baseUrl}/api/v1/toppings/${name}`, data, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }),

  deleteTopping: (name: string, token: string): Promise<any> => 
    request.delete(`${baseUrl}/api/v1/toppings/${name}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }),

  getPizzas: (): Promise<any> => request.get(`${baseUrl}/api/v1/pizzas`),

  addPizza: (data: { name: string; toppings: string[]; crust: string; sauce: string; cheese: string }, token: string): Promise<any> =>
    request.post(`${baseUrl}/api/v1/pizzas/`, data, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }),

  updatePizza: (name: string, data: { name?: string; toppings?: string[]; crust?: string; sauce?: string; cheese?: string }, token: string): Promise<any> =>
    request.put(`${baseUrl}/api/v1/pizzas/${name}`, data, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }),

  deletePizza: (name: string, token: string): Promise<any> => 
    request.delete(`${baseUrl}/api/v1/pizzas/${name}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }),
};

export default { Requests };
