import { RootStore } from "./rootStore";
import { observable, action, reaction, computed } from "mobx";

export default class CommonStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.token,
      (token) => {
        if (token) {
          window.localStorage.setItem("jwt", token);
        } else {
          window.localStorage.removeItem("jwt");
        }
      }
    );

    reaction(
      () => this.refreshToken,
      (refreshToken) => {
        if (refreshToken) {
          window.localStorage.setItem("refreshToken", refreshToken);
        } else {
          window.localStorage.removeItem("refreshToken");
        }
      }
    );
  }

  @computed get role() {
    return this.getRoleFromJwt(this.token);
  }

  getRoleFromJwt(token: string | null) {
    if (token) {
      let data = token.split(".")[1];
      let jsonData = window.atob(data);
      let decodedData = JSON.parse(jsonData);
      return decodedData.role;
    }
  }

  @observable token: string | null = window.localStorage.getItem("jwt");
  @observable refreshToken: string | null = window.localStorage.getItem(
    "refreshToken"
  );

  @observable appLoaded = false;
  @action setAppLoaded = () => {
    this.appLoaded = true;
  };

  @action setToken = (token: string | null) => {
    this.token = token;
  };

  @action setRefreshToken = (refreshToken: string | null) => {
    this.refreshToken = refreshToken;
  };
}
