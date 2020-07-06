export interface IRoom {
  id: string;
  name: string;
}

export interface IRoomWithLocation extends IRoom {
  locationId: string;
}

export class RoomFormValues {
  id?: string = undefined;
  name: string = "";
  locationId: string = "";
}
