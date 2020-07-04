import { RootStore } from "./rootStore";
import { observable, runInAction, action, computed } from "mobx";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { IRoom, IRoomWithLocation } from "../models/room";

export default class RoomStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  @observable roomRegistry = new Map();
  @observable room: IRoom | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;

  @computed get sortedRoomsByName() {
    return this.groupRoomsByLocation(Array.from(this.roomRegistry.values()));
  }

  groupRoomsByLocation(rooms: IRoomWithLocation[]) {
    const sortedRooms = rooms.sort((a, b) => a.name.localeCompare(b.name));
    return Object.entries(
      sortedRooms.reduce((rooms, room) => {
        const location = room.Location.name;
        rooms[location] = rooms[location] ? [...rooms[location], room] : [room];
        return rooms;
      }, {} as { [key: string]: IRoomWithLocation[] })
    );
  }

  @action loadRooms = async () => {
    this.loadingInitial = true;
    try {
      const rooms = await agent.Rooms.list();
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
    let roomToCreate: IRoom = {
      id: room.id,
      name: room.name,
      locationId: room.Location.id,
    };
    try {
      await agent.Rooms.create(roomToCreate);
      runInAction("create room", () => {
        this.roomRegistry.set(room.id, room);
      });
    } catch (error) {
      toast.error("Problem submitting data");
      console.log(error.response);
    }
    runInAction("toggle button loading indiciator", () => {
      this.submitting = false;
    });
  };

  @action editRoom = async (room: IRoomWithLocation) => {
    this.submitting = true;
    let roomToEdit = { id: room.id, name: room.name };
    try {
      await agent.Rooms.edit(roomToEdit);
      runInAction(() => {
        this.roomRegistry.set(room.id, room);
      });
    } catch (error) {
      toast.error("Problem submitting data");
      console.log(error);
    }
    runInAction("toggle button loading indiciator", () => {
      this.submitting = false;
    });
  };

  @action deleteRoom = async (id: string) => {
    this.submitting = true;
    try {
      await agent.Rooms.delete(id);
      runInAction("delete room", () => {
        this.roomRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    }
    runInAction("toggle submitting", () => {
      this.submitting = false;
    });
  };
}
