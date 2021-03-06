import { RootStore } from "./rootStore";
import { observable, runInAction, action, computed } from "mobx";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { IRoom, IRoomWithLocation } from "../models/room";
import { SyntheticEvent } from "react";

export default class RoomStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  @observable roomRegistry = new Map();
  @observable room: IRoom | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable roomTarget = "";

  @computed get sortedRoomsByName() {
    return this.sortRoomsByName(Array.from(this.roomRegistry.values()));
  }

  sortRoomsByName(rooms: IRoom[]) {
    const sortedRooms = rooms.sort((a, b) => a.name.localeCompare(b.name));
    return sortedRooms;
  }

  @action loadRooms = async (locationId: string) => {
    this.roomRegistry.clear();
    this.loadingInitial = true;
    try {
      const rooms = await agent.Rooms.list(locationId);
      runInAction("loading Rooms", () => {
        rooms.forEach((room) => {
          this.roomRegistry.set(room.id, room);
        });
      });
    } catch (error) {
      console.log(error);
    }
    runInAction("toggle loading indicator", () => {
      this.loadingInitial = false;
    });
  };

  @action createRoom = async (room: IRoomWithLocation) => {
    this.submitting = true;

    try {
      await agent.Rooms.create(room);
      runInAction("create room", () => {
        this.roomRegistry.set(room.id, { id: room.id, name: room.name });
      });
    } catch (error) {
      toast.error("Problem submitting data");
      console.log(error.response);
    }
    runInAction("toggle button loading indicator", () => {
      this.submitting = false;
    });
  };

  @action editRoom = async (room: IRoom) => {
    this.submitting = true;
    console.log(room);
    try {
      await agent.Rooms.edit(room);
      runInAction(() => {
        this.roomRegistry.set(room.id, room);
      });
    } catch (error) {
      toast.error("Problem submitting data");
    }
    runInAction("toggle button loading indicator", () => {
      this.submitting = false;
    });
  };

  @action deleteRoom = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.roomTarget = event.currentTarget.name;
    try {
      await agent.Rooms.delete(id);
      runInAction("delete room", () => {
        this.roomRegistry.delete(id);
        this.roomTarget = "";
      });
    } catch (error) {
      console.log(error);
    }
    runInAction("toggle submitting", () => {
      this.submitting = false;
      this.roomTarget = "";
    });
  };

  @action clearRooms = () => {
    this.roomRegistry.clear();
  };
}
