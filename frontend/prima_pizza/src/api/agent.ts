// Default Imports
import axios, { AxiosResponse } from "axios";

/* eslint-disable @typescript-eslint/no-explicit-any */
const nodeEnv = process.env.NEXT_PUBLIC_NODE_ENV || "LOCAL"; 
let baseUrl;
let allowCredentials = false;

if (nodeEnv === "PROD") {
  baseUrl = "/api";  
  allowCredentials = false;
} else if (nodeEnv === "LOCAL") {
  baseUrl = process.env.NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_LOCAL || "http://localhost:5005";
  allowCredentials = false;
} else {
  baseUrl = process.env.NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_DEV || "https://prima-pizza-backend-west.azurewebsites.net";
  allowCredentials = true;
}


if (nodeEnv !== "LOCAL" && baseUrl && baseUrl.startsWith('http://')) {
    baseUrl = baseUrl.replace('http://', 'https://');
}

console.log('Current environment:', nodeEnv);
console.log('DEV URL:', process.env.NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_DEV);
console.log('LOCAL URL:', process.env.NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_LOCAL);
console.log('Base URL being used:', baseUrl);

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
        delete config.headers['Origin'];
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
    request.post(`/api/v1/auth/login`, data),

  getToppings: (): Promise<any> => 
    request.get(`/api/v1/toppings`),

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
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/* eslint-disable import/no-anonymous-default-export */
export default { Requests };
/* eslint-enable import/no-anonymous-default-export */
