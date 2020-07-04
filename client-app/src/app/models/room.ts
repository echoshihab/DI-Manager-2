import { ILocation } from "./location";

export interface IRoom {
  id: string;
  name: string;
  locationId?: string;
}

export interface IRoomWithLocation {
  id: string;
  name: string;
  Location: ILocation;
}

export class RoomFormValues {
  id?: string = undefined;
  name: string = "";
  locationId: string = "";
}
