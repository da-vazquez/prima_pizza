// Default Imports
import axios, { AxiosResponse } from "axios";

/* eslint-disable @typescript-eslint/no-explicit-any */
const nodeEnv = process.env.NEXT_PUBLIC_NODE_ENV || "LOCAL"; 
let baseUrl = "";
let allowCredentials = false

if (nodeEnv === "LOCAL") {
  baseUrl = process.env.NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_LOCAL || "http://localhost:5005";
  allowCredentials = true;
} else if (nodeEnv === "PROD") {
  baseUrl = process.env.NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_PROD || "https://prima-pizza-backend-west.azurewebsites.net";
  allowCredentials = true;
}

console.log('Current environment:', nodeEnv);
console.log('PROD URL:', process.env.NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_PROD);
console.log('LOCAL URL:', process.env.NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_LOCAL);
console.log('Base URL being used:', baseUrl);
console.log('Using credentials:', allowCredentials);

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: allowCredentials
});

axiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            window.location.href = '/login';
        }
        if (error.message === 'Network Error') {
            console.log('Network error occurred:', error);
        }
        return Promise.reject(error);
    }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

interface AuthData {
  username: string;
  password: string;
  role?: string;
}

interface ToppingData {
  name: string;
  price: number;
  topping_type: string;
}

interface PizzaData {
  name: string;
  toppings: string[];
  crust: string;
  sauce: string;
  cheese: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const request = {
  get: <T>(url: string, config?: { headers: { Authorization?: string; "Content-Type": string } }): Promise<T> =>
    axiosInstance.get(url, config).then(responseBody),

  post: <T>(url: string, body: object, config?: { headers: { Authorization?: string; "Content-Type": string } }): Promise<T> =>
    axiosInstance.post(url, body, config).then(responseBody),

  put: <T>(url: string, body: object, config?: { headers: { Authorization?: string; "Content-Type": string } }): Promise<T> =>
    axiosInstance.put(url, body, config).then(responseBody),

  delete: <T>(url: string, config?: { headers: { Authorization?: string; "Content-Type": string } }): Promise<T> =>
    axiosInstance.delete(url, config).then(responseBody),
};

const Requests = {
  login: (data: AuthData): Promise<any> => 
    request.post('/api/v1/auth/login', data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }),
  getToppings: (): Promise<any> => request.get(`/api/v1/toppings`),
  addTopping: (data: ToppingData, token: string): Promise<any> =>
    request.post(`/api/v1/toppings/`, data, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }),
  updateTopping: (name: string, data: Partial<ToppingData>, token: string): Promise<any> =>
    request.put(`/api/v1/toppings/${name}`, data, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }),
  deleteTopping: (name: string, token: string): Promise<any> => 
    request.delete(`/api/v1/toppings/${name}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }),
  getPizzas: (): Promise<any> => request.get(`/api/v1/pizzas`),
  addPizza: (data: PizzaData, token: string): Promise<any> =>
    request.post(`/api/v1/pizzas/`, data, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }),
  updatePizza: (name: string, data: Partial<PizzaData>, token: string): Promise<any> =>
    request.put(`/api/v1/pizzas/${name}`, data, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }),
  deletePizza: (name: string, token: string): Promise<any> => 
    request.delete(`/api/v1/pizzas/${name}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }),
  getDashboardStats: (): Promise<any> => request.get(`/api/v1/dashboard/pizza_topping_count`),
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/* eslint-disable import/no-anonymous-default-export */
export default { Requests };
/* eslint-enable import/no-anonymous-default-export */
