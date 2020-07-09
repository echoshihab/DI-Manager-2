import { RootStore } from "./rootStore";
import { observable, runInAction, action, computed, toJS } from "mobx";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { ITechnologist, ITechnologistLicenses } from "../models/technologist";
import { ILicense } from "../models/license";

export default class TechnologistStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  @observable technologistRegistry = new Map();
  @observable technologist: ITechnologist | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;

  @computed get sortedTechnologistByInitial() {
    return this.sortTechnologistByInitial(
      Array.from(this.technologistRegistry.values())
    );
  }

  sortTechnologistByInitial(technologist: ITechnologist[]) {
    if (technologist && technologist.length) {
      return technologist;
    }
    const sortedTechnologists = technologist.sort((a, b) =>
      a.initial.localeCompare(b.initial)
    );
    return sortedTechnologists;
  }

  @action loadTechnologists = async (modalityId: string) => {
    this.technologistRegistry.clear();
    this.loadingInitial = true;
    try {
      const technologists = await agent.Technologists.list(modalityId);
      console.log(technologists);
      runInAction("loading technologists", () => {
        technologists.forEach((technologist) => {
          this.technologistRegistry.set(technologist.id, technologist);
        });
      });
    } catch (error) {
      console.log(error);
    }
    runInAction("toggle loading indicator", () => {
      this.loadingInitial = false;
    });
  };

  @action createTechnologist = async (technologist: ITechnologist) => {
    this.submitting = true;
    let licenses: ITechnologistLicenses[] = [];
    technologist.licenses.forEach((license: ITechnologistLicenses) => {
      let storedlicense: ILicense = this.rootStore.licenseStore.licenseRegistry.get(
        license.licenseId
      ); //accessing license store to retrieve license display name
      licenses.push({
        licenseId: storedlicense.id,
        licenseDisplayName: storedlicense.displayName,
      });
    });
    console.log(licenses);
    try {
      await agent.Technologists.create(technologist);
      runInAction("create technologist", () => {
        this.technologistRegistry.set(technologist.id, {
          id: technologist.id,
          name: technologist.name,
          initial: technologist.initial,
          licenseIdList: licenses,
        });
      });
    } catch (error) {
      toast.error("Problem submitting data");
      console.log(error.response);
    }
    runInAction("toggle button loading indicator", () => {
      this.submitting = false;
    });
  };

  @action editTechnologist = async (technologist: ITechnologist) => {
    this.submitting = true;
    try {
      await agent.Technologists.edit(technologist);
      runInAction(() => {
        this.technologistRegistry.set(technologist.id, technologist);
      });
    } catch (error) {
      toast.error("Problem submitting data");
    }
    runInAction("toggle button loading indicator", () => {
      this.submitting = false;
    });
  };

  @action deleteTechnologist = async (id: string) => {
    this.submitting = true;
    try {
      await agent.Technologists.delete(id);
      runInAction("delete technologst", () => {
        this.technologistRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    }
    runInAction("toggle submitting", () => {
      this.submitting = false;
    });
  };
}
