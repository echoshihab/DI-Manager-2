import axios, { AxiosResponse } from "axios";
import { IShift, ShiftFormValues } from "../models/shift";
import { IModality } from "../models/modality";
import { history } from "../..";
import { toast } from "react-toastify";
import { ILocation } from "../models/location";
import { IRoom } from "../models/room";
import { ILicense } from "../models/license";
import {
  ITechnologist,
  ITechnologistForm,
  ITechnologistEdit,
} from "../models/technologist";
import { IUserFormValues, IUser, IUserSlim } from "../models/user";
import { promises } from "dns";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("jwt");

    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, (error) => {
  const originalRequest = error.config;
  if (error.message === "Network Error" && !error.response) {
    toast.error("Network error- Problem communicating with server!");
  }
  const { status, data, config } = error.response;

  if (status === 404) {
    history.push("/notfound");
  }
  if (status === 401 && originalRequest.url.endsWith("refresh")) {
    window.localStorage.removeItem("jwt");
    window.localStorage.removeItem("refreshToken");
    history.push("/");
    toast.info("Please login again, session expired");
    return Promise.reject(error);
  }
  if (status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    return axios
      .post("user/refresh", {
        token: window.localStorage.getItem("jwt"),
        refreshToken: window.localStorage.getItem("refreshToken"),
      })
      .then((res) => {
        window.localStorage.setItem("jwt", res.data.token);
        window.localStorage.setItem("refreshToken", res.data.refreshToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;
        return axios(originalRequest);
      });
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
  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

const requests = {
  get: (url: string) => axios.get(url).then(sleep(500)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(500)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(500)).then(responseBody),
  delete: (url: string) =>
    axios.delete(url).then(sleep(500)).then(responseBody),
};

const Shifts = {
  list: (params: URLSearchParams): Promise<IShift[]> =>
    axios
      .get("/shifts", { params: params })
      .then(sleep(500))
      .then(responseBody), //used axios directly here to pass params
  create: (shift: ShiftFormValues) => requests.post("/shifts", shift),
  createRange: (shift: ShiftFormValues) =>
    requests.post("/shifts/range", shift),
  details: (id: string) => requests.get(`/shifts/${id}`),
  edit: (shift: ShiftFormValues) => requests.put(`/shifts/${shift.id}`, shift),
  delete: (id: string) => requests.delete(`/shifts/${id}`),
};

const Modalities = {
  list: (): Promise<IModality[]> => requests.get("/modality"),
  create: (modality: IModality) => requests.post("/modality", modality),
  edit: (modality: IModality) =>
    requests.put(`/modality/${modality.id}`, modality),
  delete: (id: string) => requests.delete(`/modality/${id}`),
};

const Locations = {
  list: (): Promise<ILocation[]> => requests.get("/location"),
  create: (location: ILocation) => requests.post("/location", location),
  edit: (location: ILocation) =>
    requests.put(`/location/${location.id}`, location),
  delete: (id: string) => requests.delete(`/location/${id}`),
};

const Rooms = {
  list: (locationId: string): Promise<IRoom[]> =>
    requests.get(`/room?locationId=${locationId}`),
  create: (room: IRoom) => requests.post("/room", room),
  edit: (room: IRoom) => requests.put(`/room/${room.id}`, room),
  delete: (id: string) => requests.delete(`/room/${id}`),
};

const Licenses = {
  list: (modalityId: string): Promise<ILicense[]> =>
    requests.get(`/license?modalityId=${modalityId}`),
  create: (license: ILicense) => requests.post("/license", license),
  edit: (license: ILicense) => requests.put(`/license/${license.id}`, license),
  delete: (id: string) => requests.delete(`/license/${id}`),
};

const Technologists = {
  list: (modalityId: string): Promise<ITechnologist[]> =>
    requests.get(`/technologist?modalityId=${modalityId}`),
  create: (technologist: ITechnologistForm) =>
    requests.post("/technologist", technologist),
  edit: (technologist: ITechnologistEdit) =>
    requests.put(`/technologist/${technologist.id}`, technologist),
  delete: (id: string) => requests.delete(`/technologist/${id}`),
};

const User = {
  current: (): Promise<IUser> => requests.get("/user"),
  login: (user: IUserFormValues): Promise<IUser> =>
    requests.post(`/user/login`, user),
  register: (user: IUserFormValues): Promise<IUser> =>
    requests.post(`/user/register`, user),
  list: (): Promise<IUserSlim[]> => requests.get("/user/list"),
  roles: (): Promise<string[]> => requests.get("user/roles"),
  update: (user: IUserSlim) => requests.put("user/update", user),
};

export default {
  Shifts,
  Modalities,
  Locations,
  Rooms,
  Licenses,
  Technologists,
  User,
};
