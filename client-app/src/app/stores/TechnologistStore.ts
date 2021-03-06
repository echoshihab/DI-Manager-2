import { RootStore } from "./rootStore";
import { observable, runInAction, action, computed } from "mobx";
import agent from "../api/agent";
import { toast } from "react-toastify";
import {
  ITechnologist,
  ITechnologistLicenses,
  ITechnologistForm,
  ITechnologistEdit,
} from "../models/technologist";
import { ILicense } from "../models/license";
import { SyntheticEvent } from "react";

export default class TechnologistStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  @observable technologistRegistry = new Map();
  @observable technologist: ITechnologist | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable targetTechnologist = "";

  @computed get sortedTechnologistByInitial() {
    return this.sortTechnologistByInitial(
      Array.from(this.technologistRegistry.values())
    );
  }

  sortTechnologistByInitial(technologist: ITechnologist[]) {
    if (technologist && technologist.length) {
      const sortedTechnologists = technologist.sort((a, b) =>
        a.initial.localeCompare(b.initial)
      );
      return sortedTechnologists;
    }
    return technologist;
  }
  @action selectTechnologist = (id: string) => {
    this.technologist = this.technologistRegistry.get(id);
  };

  @action clearTechnologists = () => {
    this.technologistRegistry.clear();
  };

  @action loadTechnologists = async (modalityId: string) => {
    this.technologistRegistry.clear();
    this.loadingInitial = true;
    try {
      const technologists = await agent.Technologists.list(modalityId);

      runInAction("loading technologists", () => {
        technologists.forEach((technologist) => {
          this.technologistRegistry.set(technologist.id, technologist);
        });
      });
    } catch (error) {
      toast.error(error);
    }
    runInAction("toggle loading indicator", () => {
      this.loadingInitial = false;
    });
  };

  getLicenseIdAndNameForTechnologist = (licenseIdList: string[]) => {
    let licenseArray: ILicense[] = licenseIdList.map((id) =>
      this.rootStore.licenseStore.licenseRegistry.get(id)
    );
    let licenseNameAndId = licenseArray.map((license) => ({
      licenseId: license.id,
      licenseDisplayName: license.displayName,
    }));
    return licenseNameAndId;
  };

  @action createTechnologist = async (technologist: ITechnologistForm) => {
    this.submitting = true;

    if (typeof technologist.licenseIdList === "undefined") {
      technologist.licenseIdList = [];
    }
    let licenses: ITechnologistLicenses[] = this.getLicenseIdAndNameForTechnologist(
      technologist.licenseIdList
    );

    try {
      await agent.Technologists.create(technologist);
      runInAction("create technologist", () => {
        this.technologistRegistry.set(technologist.id, {
          id: technologist.id,
          name: technologist.name,
          initial: technologist.initial,
          licenses: licenses,
        } as ITechnologist);
      });
    } catch (error) {
      throw error;
    }
    runInAction("toggle button loading indicator", () => {
      this.submitting = false;
    });
  };

  @action editTechnologist = async (technologist: ITechnologistEdit) => {
    this.submitting = true;
    if (typeof technologist.licenseIdList === "undefined") {
      technologist.licenseIdList = [];
    }
    let licenses: ITechnologistLicenses[] = this.getLicenseIdAndNameForTechnologist(
      technologist.licenseIdList
    );
    try {
      await agent.Technologists.edit(technologist);
      runInAction(() => {
        this.technologistRegistry.set(technologist.id, {
          id: technologist.id,
          name: technologist.name,
          initial: technologist.initial,
          licenses: licenses,
        } as ITechnologist);
      });
    } catch (error) {
      toast.error("Problem submitting data");
    }
    runInAction("toggle button loading indicator", () => {
      this.submitting = false;
    });
  };

  @action deleteTechnologist = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.targetTechnologist = event.currentTarget.name;
    try {
      await agent.Technologists.delete(id);
      runInAction("delete technologist", () => {
        this.technologistRegistry.delete(id);
        this.targetTechnologist = "";
      });
    } catch (error) {
      console.log(error);
    }
    runInAction("toggle submitting", () => {
      this.submitting = false;
      this.targetTechnologist = "";
    });
  };
}
