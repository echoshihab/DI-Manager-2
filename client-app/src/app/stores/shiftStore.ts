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

  @observable predicate = new Map();

  @computed get shiftsByMonth() {
    return this.groupShiftsByDateForMonth(
      Array.from(this.shiftRegistry.values())
    );
  }

  @computed get shiftsByDay() {
    return this.sortShiftsForDay(Array.from(this.shiftRegistry.values()));
  }

  groupShiftsByDateForMonth(shifts: IShift[]) {
    const monthObj = {} as { [key: string]: IShift[] };
    shifts.forEach((s) => {
      let date = format(s.start, "MM/dd/yyyy");
      monthObj.hasOwnProperty(date)
        ? monthObj[date].push(s)
        : (monthObj[date] = [s]);
    });
    return monthObj;
  }

  sortShiftsForDay(shifts: IShift[]) {
    const sortedShifts = shifts.sort(
      (a, b) => a.start.getTime() - b.start.getTime()
    );
    console.log(sortedShifts);
    return sortedShifts;
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

  @action setPredicate = (predicate: string, value: string | Date) => {
    this.predicate.clear();
    if (predicate !== "all") {
      this.predicate.set(predicate, value);
    }
  };
}
