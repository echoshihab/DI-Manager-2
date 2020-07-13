import { observable, runInAction, action, computed } from "mobx";
import { IShift, ShiftFormValues, IShiftFormValues } from "../models/shift";
import { RootStore } from "./rootStore";
import agent from "../api/agent";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { ILicense } from "../models/license";
import { ITechnologist, ITechnologistLicenses } from "../models/technologist";
import { IRoom } from "../models/room";
import { ILocation } from "../models/location";

export default class ShiftStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable shiftRegistry = new Map();
  @observable shift: IShift | null = null;

  @observable loading = false;

  @observable predicate = new Map();
  @observable loadingInitial = false;
  @observable submitting = false;

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
          shift.end = new Date(shift.end);
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

  @action createShift = async (shift: ShiftFormValues) => {
    this.submitting = true;

    let technologist: ITechnologist = this.rootStore.technologistStore.technologistRegistry.get(
      shift.technologistId
    );
    let license = technologist.licenses.filter(
      (license) => license.licenseId === shift.licenseId
    );

    let room: IRoom = this.rootStore.roomStore.roomRegistry.get(shift.roomId);

    let location: ILocation = this.rootStore.locationStore.locationRegistry.get(
      shift.locationId
    );

    let newShift: IShiftFormValues = {
      id: shift.id,
      start: shift.start,
      end: shift.end,
      licenseId: shift.licenseId,
      licenseDisplayName: license[0].licenseDisplayName,
      locationId: shift.locationId,
      locationName: location.name,
      roomId: shift.roomId,
      roomName: room.name,
      technologistId: shift.technologistId,
      technologistInitial: technologist.initial,
      modalityId: shift.modalityId,
    };

    try {
      await agent.Shifts.create(shift);
      runInAction("create shift", () => {
        this.shiftRegistry.set(shift.id, newShift);
      });
    } catch (error) {
      toast.error("Problem submitting data");
      console.log(error.response);
    }
    runInAction("toggle button loading indicator", () => {
      this.submitting = false;
    });
  };

  @action setPredicate = (predicate: string, value: string | Date) => {
    this.predicate.clear();
    if (predicate !== "all") {
      this.predicate.set(predicate, value);
    }
  };

  @action deleteShift = async (id: string) => {
    this.submitting = true;
    try {
      await agent.Shifts.delete(id);
      runInAction("delete location", () => {
        this.shiftRegistry.delete(id);
      });
    } catch (error) {
      toast.error("Problem deleting");
    }
    runInAction("toggle submitting", () => {
      this.submitting = false;
    });
  };
}
