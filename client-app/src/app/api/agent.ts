import axios, { AxiosResponse } from "axios";
import { IShift } from "../models/shift";
import { IModality } from "../models/modality";
import { history } from "../..";
import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(undefined, (error) => {
  const originalRequest = error.config;
  if (error.message === "Network Error" && !error.response) {
    toast.error("Network error- Problem communicating with server!");
  }
  const { status, data, config } = error.response;

  if (status === 404) {
    history.push("/notfound");
  }
  if (
    status === 400 &&
    config.method === "get" &&
    data.errors.hasOwnProperty("id")
  ) {
    history.push("/notfound");
  }
  if (status === 500) {
    toast.error("Server Error - unable to process request");
  }
  throw error;
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const Shifts = {
  list: (): Promise<IShift[]> => requests.get("/shifts"),
  create: (shift: IShift) => requests.post("/shifts", shift),
  details: (id: string) => requests.get(`/shifts/${id}`),
  edit: (shift: IShift) => requests.put(`/shifts/${shift.id}`, shift),
  delete: (id: string) => requests.delete(`/shifts/${id}`),
};

const Modalities = {
  list: (): Promise<IModality[]> => requests.get("/modality"),
  create: (modality: IModality) => requests.post("/modality", modality),
  edit: (modality: IModality) =>
    requests.put(`/modality/${modality.id}`, modality),
  delete: (id: string) => requests.delete(`/modality/${id}`),
};

export default {
  Shifts,
  Modalities,
};
