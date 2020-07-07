import React, { useContext } from "react";
import { RootStoreContext } from "../../../../stores/rootStore";
import RoomListItem from "./RoomListItem";
import { List, Header } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../../layout/LoadingComponent";

interface IProps {
  roomsLoader: boolean;
}

const RoomList: React.FC<IProps> = ({ roomsLoader }) => {
  const rootStore = useContext(RootStoreContext);
  const { sortedRoomsByName } = rootStore.roomStore;

  return (
    <List divided relaxed>
      <Header content="Available Rooms" />

      {roomsLoader ? (
        <LoadingComponent content="loading rooms.." />
      ) : (
        sortedRoomsByName.map((room) => (
          <List.Item key={room.id}>
            <List.Content>
              <RoomListItem room={room} />
            </List.Content>
          </List.Item>
        ))
      )}
    </List>
  );
};

export default observer(RoomList);
