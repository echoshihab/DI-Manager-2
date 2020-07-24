import { RootStore } from "./rootStore";
import { observable, runInAction, action, computed } from "mobx";
import { IModality } from "../models/modality";
import agent from "../api/agent";
import { toast } from "react-toastify";

export default class ModalityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  @observable modalityRegistry = new Map();
  @observable modality: IModality | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;

  @computed get sortedModalitiesByDisplayName() {
    return Array.from(
      this.modalityRegistry.values()
    ).sort((a: IModality, b: IModality) =>
      a.displayName.localeCompare(b.displayName)
    );
  }

  @action loadModalities = async () => {
    this.loadingInitial = true;
    try {
      const modalities = await agent.Modalities.list();
      runInAction("loading modalities", () => {
        modalities.forEach((modality) => {
          console.log(modality);
          this.modalityRegistry.set(modality.id, modality);
        });
      });
    } catch (error) {
      console.log(error);
    }
    runInAction("toggle loading indicator", () => {
      this.loadingInitial = false;
    });
  };

  @action createModality = async (modality: IModality) => {
    this.submitting = true;
    try {
      await agent.Modalities.create(modality);
      runInAction("create modality", () => {
        this.modalityRegistry.set(modality.id, modality);
      });
    } catch (error) {
      toast.error("Problem submitting data");
      console.log(error.response);
    }
    runInAction("toggle button loading indiciator", () => {
      this.submitting = false;
    });
  };

  @action editModality = async (modality: IModality) => {
    this.submitting = true;
    try {
      await agent.Modalities.edit(modality);
      runInAction(() => {
        this.modalityRegistry.set(modality.id, modality);
      });
    } catch (error) {
      toast.error("Problem submitting data");
      console.log(error);
    }
    runInAction("toggle button loading indiciator", () => {
      this.submitting = false;
    });
  };

  @action deleteModality = async (id: string) => {
    this.submitting = true;
    try {
      await agent.Modalities.delete(id);
      runInAction("delete Modality", () => {
        this.modalityRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    }
    runInAction("toggle submitting", () => {
      this.submitting = false;
    });
  };
}
