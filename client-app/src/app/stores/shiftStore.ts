import { observable, runInAction, action, computed } from "mobx";
import { IShift } from "../models/shift";
import { RootStore } from "./rootStore";
import agent from "../api/agent";

export default class ShiftStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable shiftRegistry = new Map();
  @observable shifts: IShift[] = [];
  @observable shift: IShift | null = null;
  @observable loading = false;

  @action loadShifts = async () => {
    this.loading = true;
    try {
      const shifts = await agent.Shifts.list();
      runInAction("loading shifts", () => {
        this.shifts = shifts;
      });
    } catch (error) {
      console.log(error);
    }
    runInAction("toggle loading indicator", () => {
      this.loading = false;
    });
  };
}
