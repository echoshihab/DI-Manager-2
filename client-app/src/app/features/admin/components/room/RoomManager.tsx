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
  const { loadRooms } = rootStore.roomStore;
  const { setAppLoaded, appLoaded } = rootStore.commonStore;

  const [rooms, setRooms] = useState(false);

  useEffect(() => {
    loadLocations().finally(() => setAppLoaded());
  }, [loadLocations, setAppLoaded]);

  const handleLocationChange = (locationId: string) => {
    loadRooms(locationId).then(() => setRooms(true));
  };

  if (!appLoaded) return <LoadingComponent content="Loading app..." />;
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
          <Segment color="blue">{rooms && <RoomList />}</Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default observer(RoomManager);
