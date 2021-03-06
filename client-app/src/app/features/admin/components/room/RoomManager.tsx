import React, { useContext, useEffect, useState } from "react";
import { RootStoreContext } from "../../../../stores/rootStore";
import LoadingComponent from "../../../../layout/LoadingComponent";
import { Container, Header, Grid, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import RoomForm from "./RoomForm";
import RoomList from "./RoomList";

const RoomManager = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadLocations } = rootStore.locationStore;
  const { loadRooms, clearRooms } = rootStore.roomStore;
  const [roomsLoader, setRoomsLoader] = useState(false);

  useEffect(() => {
    loadLocations();
    return () => {
      setRoomsLoader(true);
      clearRooms();
      setRoomsLoader(false);
    };
  }, [loadLocations, clearRooms]);

  const handleLocationChange = (locationId: string) => {
    setRoomsLoader(true);
    loadRooms(locationId).then(() => setRoomsLoader(false));
  };

  return (
    <Container style={{ width: "800px" }}>
      <Header
        as="h3"
        content="Manage Rooms"
        style={{ marginTop: ".5em" }}
        textAlign="center"
      />
      <Grid centered columns={1}>
        <Grid.Column>
          <Segment color="green" clearing>
            <RoomForm changeLocation={handleLocationChange} />
          </Segment>
        </Grid.Column>
        <Grid.Column>
          {roomsLoader ? (
            <Grid.Column style={{ marginTop: "20px" }}>
              <LoadingComponent content="loading rooms.." />
            </Grid.Column>
          ) : (
            <Segment color="blue">
              <RoomList />
            </Segment>
          )}
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default observer(RoomManager);
