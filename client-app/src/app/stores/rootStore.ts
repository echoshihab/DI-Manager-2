import { configure } from "mobx";
import { createContext } from "react";
import ShiftStore from "./shiftStore";
import ModalityStore from "./modalityStore";
import CommonStore from "./commonStore";
import LocationStore from "./locationStore";
import RoomStore from "./RoomStore";

configure({ enforceActions: "always" });

export class RootStore {
  shiftStore: ShiftStore;
  modalityStore: ModalityStore;
  locationStore: LocationStore;
  commonStore: CommonStore;
  roomStore: RoomStore;

  constructor() {
    this.shiftStore = new ShiftStore(this);
    this.modalityStore = new ModalityStore(this);
    this.commonStore = new CommonStore(this);
    this.locationStore = new LocationStore(this);
    this.roomStore = new RoomStore(this);
  }
}
export const RootStoreContext = createContext(new RootStore());
