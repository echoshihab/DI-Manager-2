import { RootStore } from "./rootStore";
import { observable, runInAction, action, computed } from "mobx";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { ILicense, ILicenseWithModality } from "../models/license";

export default class LicenseStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  @observable licenseRegistry = new Map();
  @observable license: ILicense | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;

  @computed get sortedLicenseByName() {
    return this.sortLicenseByName(Array.from(this.licenseRegistry.values()));
  }
  @computed get selectedLicense() {
    return this.license;
  }

  @action.bound selectLicense(id: string) {
    this.license = this.licenseRegistry.get(id);
  }

  sortLicenseByName(license: ILicense[]) {
    const sortedLicenses = license.sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    );
    return sortedLicenses;
  }

  @action loadLicenses = async (modalityId: string) => {
    this.licenseRegistry.clear();
    this.loadingInitial = true;
    try {
      const licenses = await agent.Licenses.list(modalityId);
      runInAction("loading licenses", () => {
        licenses.forEach((license) => {
          this.licenseRegistry.set(license.id, license);
        });
      });
    } catch (error) {
      console.log(error);
    }
    runInAction("toggle loading indicator", () => {
      this.loadingInitial = false;
    });
  };

  @action createLicense = async (license: ILicenseWithModality) => {
    this.submitting = true;

    try {
      await agent.Licenses.create(license);
      runInAction("create license", () => {
        this.licenseRegistry.set(license.id, {
          id: license.id,
          name: license.name,
          displayName: license.displayName,
        });
      });
    } catch (error) {
      toast.error("Problem submitting data");
      console.log(error.response);
    }
    runInAction("toggle button loading indiciator", () => {
      this.submitting = false;
    });
  };

  @action editLicense = async (license: ILicense) => {
    this.submitting = true;
    try {
      await agent.Licenses.edit(license);
      runInAction(() => {
        this.licenseRegistry.set(license.id, license);
      });
    } catch (error) {
      toast.error("Problem submitting data");
    }
    runInAction("toggle button loading indicator", () => {
      this.submitting = false;
    });
  };

  @action deleteLicense = async (id: string) => {
    this.submitting = true;
    try {
      await agent.Licenses.delete(id);
      runInAction("delete license", () => {
        this.licenseRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    }
    runInAction("toggle submitting", () => {
      this.submitting = false;
    });
  };
}
