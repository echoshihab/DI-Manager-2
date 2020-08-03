import { RootStore } from "./rootStore";
import { observable, runInAction, action, computed } from "mobx";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { ILocation } from "../models/location";
import { SyntheticEvent } from "react";

export default class LocationStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  @observable locationRegistry = new Map();
  @observable location: ILocation | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable targetLocation = "";

  @computed get sortedLocationByName() {
    return this.sortLocationsByName(Array.from(this.locationRegistry.values()));
  }

  sortLocationsByName(locations: ILocation[]) {
    const sortedLocations = locations.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    return sortedLocations;
  }

  @action loadLocations = async () => {
    this.loadingInitial = true;
    try {
      const locations = await agent.Locations.list();
      runInAction("loading Locations", () => {
        locations.forEach((location) => {
          this.locationRegistry.set(location.id, location);
        });
      });
    } catch (error) {
      toast.error("Problem loading locations");
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
    }
    runInAction("toggle button loading indiciator", () => {
      this.submitting = false;
    });
  };

  @action deleteLocation = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.targetLocation = event.currentTarget.name;
    try {
      await agent.Locations.delete(id);
      runInAction("delete location", () => {
        this.locationRegistry.delete(id);
        this.targetLocation = "";
      });
    } catch (error) {
      toast.error("Problem deleting");
    }
    runInAction("toggle submitting", () => {
      this.submitting = false;
      this.targetLocation = "";
    });
  };
}
