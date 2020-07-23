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
          console.log("removing token");
          window.localStorage.removeItem("jwt");
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

  @observable appLoaded = false;
  @action setAppLoaded = () => {
    this.appLoaded = true;
  };

  @action setToken = (token: string | null) => {
    this.token = token;
  };
}
