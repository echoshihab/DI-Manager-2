import { RootStore } from "./rootStore";
import { observable, action } from "mobx";

export default class CommonStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable appLoaded = false;
  @action setAppLoaded = () => {
    this.appLoaded = true;
  };
}
