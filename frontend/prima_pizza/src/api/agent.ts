// Default Imports
import axios, { AxiosResponse } from "axios";

const baseUrl = "http://localhost:5005"
const responseBody = <T>(response: AxiosResponse<T>) => response;

// Helper for requests
const request = {
  get: (url: string, p0: { headers: { Authorization: string; "Content-Type": string; }; }) =>
    axios.get(url, p0).then(responseBody),
  
  post: (url: string, body: object, p0: { headers: { "Content-Type": string; }; }) =>
    axios.post(url, body, p0).then(responseBody),
};

// Requests to API
const Requests = {
  login: (data: { username: string; password: string }): Promise<any> =>
    request.post(`${baseUrl}/api/v1/auth/login`, data, {
      headers: {
        "Content-Type": "application/json"
      }
    }),

  register: (data: { username: string; password: string; role: string }): Promise<any> =>
    request.post(`${baseUrl}/api/v1/auth/register`, data, {
      headers: {
        "Content-Type": "application/json"
      }
    }),
};


export default { Requests };
