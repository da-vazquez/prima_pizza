// Default Imports
import axios, { AxiosResponse } from "axios";


const nodeEnv = process.env.NEXT_PUBLIC_NODE_ENV || "LOCAL"; 
let baseUrl = process.env.NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_DEV;

if (baseUrl && baseUrl.startsWith('http://')) {
    baseUrl = baseUrl.replace('http://', 'https://');
}

console.log('Current environment:', nodeEnv);
console.log('DEV URL:', process.env.NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_DEV);
console.log('LOCAL URL:', process.env.NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_LOCAL);

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
    maxRedirects: 5,
});

axiosInstance.interceptors.request.use((config) => {
    if (config.url && config.url.startsWith('http://')) {
        config.url = config.url.replace('http://', 'https://');
    }
    return config;
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.message === 'Network Error') {
            console.error('Network error occurred');
        }
        return Promise.reject(error);
    }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;


const request = {
  get: (url: string, config?: { headers: { Authorization?: string; "Content-Type": string } }) =>
    axiosInstance.get(url, config).then(responseBody),

  post: (url: string, body: object, config?: { headers: { Authorization?: string; "Content-Type": string } }) =>
    axiosInstance.post(url, body, config).then(responseBody),

  put: (url: string, body: object, config?: { headers: { Authorization?: string; "Content-Type": string } }) =>
    axiosInstance.put(url, body, config).then(responseBody),

  delete: (url: string, config?: { headers: { Authorization?: string; "Content-Type": string } }) =>
    axiosInstance.delete(url, config).then(responseBody),
};


const Requests = {
  login: (data: { username: string; password: string }): Promise<any> =>
    request.post(`/api/v1/auth/login`, data, {
      headers: { "Content-Type": "application/json" }
    }),

  register: (data: { username: string; password: string; role: string }): Promise<any> =>
    request.post(`/api/v1/auth/register`, data, {
      headers: { "Content-Type": "application/json" }
    }),

  getToppings: (): Promise<any> => 
    request.get(`/api/v1/toppings`),

  addTopping: (data: { name: string; price: number; topping_type: string }, token: string): Promise<any> =>
    request.post(`/api/v1/toppings/`, data, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }),

  updateTopping: (name: string, data: { name?: string; price?: number; topping_type?: string }, token: string): Promise<any> =>
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

  addPizza: (data: { name: string; toppings: string[]; crust: string; sauce: string; cheese: string }, token: string): Promise<any> =>
    request.post(`/api/v1/pizzas/`, data, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }),

  updatePizza: (name: string, data: { name?: string; toppings?: string[]; crust?: string; sauce?: string; cheese?: string }, token: string): Promise<any> =>
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


export default { Requests };
