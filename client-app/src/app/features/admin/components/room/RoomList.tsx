import React, { useContext } from "react";
import { RootStoreContext } from "../../../../stores/rootStore";
import RoomListItem from "./RoomListItem";
import { List, Header } from "semantic-ui-react";
import { observer } from "mobx-react-lite";

const RoomList = () => {
  const rootStore = useContext(RootStoreContext);
  const { sortedRoomsByName } = rootStore.roomStore;

  return (
    <List divided relaxed>
      <Header content="Available Rooms" />

      {sortedRoomsByName.map((room) => (
        <List.Item key={room.id}>
          <List.Content>
            <RoomListItem room={room} key={room.id} />
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

export default observer(RoomList);
