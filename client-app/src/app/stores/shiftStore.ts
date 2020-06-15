import { observable, runInAction, action, computed } from "mobx";
import { IShift } from "../models/shift";
import { RootStore } from "./rootStore";
import agent from "../api/agent";
import { format } from "date-fns";

export default class ShiftStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable shiftRegistry = new Map();
  @observable shift: IShift | null = null;
  @observable loading = false;

  @computed get shiftsByDate() {
    console.log(Array.from(this.shiftRegistry.values()));
    return this.groupShiftsByDate(Array.from(this.shiftRegistry.values()));
  }

  groupShiftsByDate(shifts: IShift[]) {
    // const sortedshifts = shifts.sort((a, b) => {
    //   return a.start.getTime() - b.start.getTime();
    // });
    // return Object.entries(
    //   sortedshifts.reduce((shifts, shift) => {
    //     const date = format(shift.start, "MM/dd/yyyy");
    //     shifts[date] = shifts[date] ? [...shifts[date], shift] : [shift];
    //     return shifts;
    //   }, {} as { [key: string]: IShift[] })
    // );

    const monthObj = {} as { [key: string]: IShift[] };
    shifts.forEach((s) => {
      let date = format(s.start, "MM/dd/yyyy");
      monthObj.hasOwnProperty(date)
        ? monthObj[date].push(s)
        : (monthObj[date] = [s]);
    });
    return monthObj;
  }

  @action loadShifts = async () => {
    this.loading = true;
    try {
      const shifts = await agent.Shifts.list();
      runInAction("loading shifts", () => {
        shifts.forEach((shift) => {
          shift.start = new Date(shift.start);
          this.shiftRegistry.set(shift.id, shift);
        });
      });
    } catch (error) {
      console.log(error);
    }
    runInAction("toggle loading indicator", () => {
      this.loading = false;
    });
  };
}
