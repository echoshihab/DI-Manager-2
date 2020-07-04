import { RootStore } from "./rootStore";
import { observable, runInAction, action, computed } from "mobx";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { ILocation } from "../models/location";

export default class LocationStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  @observable locationRegistry = new Map();
  @observable location: ILocation | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;

  @computed get sortedLocationByName() {
    return Array.from(this.locationRegistry.values()).sort((a, b) =>
      a.name.localeCompare(b.displayName)
    );
  }

  @action loadLocations = async () => {
    this.loadingInitial = true;
    try {
      const locations = await agent.Locations.list();
      runInAction("loading Locations", () => {
        locations.forEach((location) => {
          console.log(location);
          this.locationRegistry.set(location.id, location);
        });
      });
    } catch (error) {
      console.log(error);
    }
    runInAction("toggle loading indicator", () => {
      this.loadingInitial = false;
    });
  };

  @action createLocation = async (location: ILocation) => {
    this.submitting = true;
    try {
      await agent.Locations.create(location);
      runInAction("create location", () => {
        this.locationRegistry.set(location.id, location);
      });
    } catch (error) {
      toast.error("Problem submitting data");
      console.log(error.response);
    }
    runInAction("toggle button loading indiciator", () => {
      this.submitting = false;
    });
  };

  @action editLocation = async (location: ILocation) => {
    this.submitting = true;
    try {
      await agent.Locations.edit(location);
      runInAction(() => {
        this.locationRegistry.set(location.id, location);
      });
    } catch (error) {
      toast.error("Problem submitting data");
      console.log(error);
    }
    runInAction("toggle button loading indiciator", () => {
      this.submitting = false;
    });
  };

  @action deleteLocation = async (id: string) => {
    this.submitting = true;
    try {
      await agent.Locations.delete(id);
      runInAction("delete location", () => {
        this.locationRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    }
    runInAction("toggle submitting", () => {
      this.submitting = false;
    });
  };
}
