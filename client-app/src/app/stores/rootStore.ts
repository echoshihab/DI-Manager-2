import { configure } from "mobx";
import { createContext } from "react";
import ShiftStore from "./shiftStore";

configure({ enforceActions: "always" });

export class RootStore {
  shiftStore: ShiftStore;

  constructor() {
    this.shiftStore = new ShiftStore(this);
  }
}
export const RootStoreContext = createContext(new RootStore());
