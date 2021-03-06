import { RootStore } from "./rootStore";
import { observable, runInAction, action, computed } from "mobx";
import { IModality } from "../models/modality";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { SyntheticEvent } from "react";

export default class ModalityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  @observable modalityRegistry = new Map();
  @observable modality: IModality | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable targetModality = "";

  @computed get sortedModalitiesByDisplayName() {
    return this.sortModalityByDisplayName(
      Array.from(this.modalityRegistry.values())
    );
  }

  sortModalityByDisplayName(modalities: IModality[]) {
    return modalities.sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    );
  }

  @action loadModalities = async () => {
    this.loadingInitial = true;
    try {
      const modalities = await agent.Modalities.list();
      runInAction("loading modalities", () => {
        modalities.forEach((modality) => {
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

  @action deleteModality = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.targetModality = event.currentTarget.name;
    try {
      await agent.Modalities.delete(id);
      runInAction("delete Modality", () => {
        this.modalityRegistry.delete(id);
        this.targetModality = "";
      });
    } catch (error) {
      console.log(error);
    }
    runInAction("toggle submitting", () => {
      this.submitting = false;
      this.targetModality = "";
    });
  };
}
