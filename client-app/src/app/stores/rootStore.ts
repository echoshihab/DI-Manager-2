import { configure } from "mobx";
import { createContext } from "react";
import ShiftStore from "./shiftStore";
import ModalityStore from "./modalityStore";

configure({ enforceActions: "always" });

export class RootStore {
  shiftStore: ShiftStore;
  modalityStore: ModalityStore;

  constructor() {
    this.shiftStore = new ShiftStore(this);
    this.modalityStore = new ModalityStore(this);
  }
}
export const RootStoreContext = createContext(new RootStore());
