import axios, { AxiosResponse } from "axios";
import { IShift } from "../models/shift";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(undefined, (error) => {
  const originalRequest = error.config;
  const status = error.status;
  console.log(originalRequest, status); //log to remove
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
};

const Shifts = {
  list: (): Promise<IShift[]> => axios.get("/shifts").then(responseBody),
};

export default {
  Shifts,
};
