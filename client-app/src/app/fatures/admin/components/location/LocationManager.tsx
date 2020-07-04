import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "../../../../stores/rootStore";
import LoadingComponent from "../../../../layout/LoadingComponent";
import { Container, Header, Grid, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import LocationForm from "./LocationForm";
import LocationList from "./LocationList";

const LocationManager = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadLocations } = rootStore.locationStore;
  const { setAppLoaded, appLoaded } = rootStore.commonStore;

  useEffect(() => {
    loadLocations().finally(() => setAppLoaded());
  }, [loadLocations, setAppLoaded]);

  if (!appLoaded) return <LoadingComponent content="Loading app..." />;
  return (
    <Container style={{ width: "800px" }}>
      <Header
        as="h3"
        content="Manage Locations"
        style={{ marginTop: ".5em" }}
        textAlign="center"
      />
      <Grid centered columns={1}>
        <Grid.Column>
          <Segment color="green" clearing>
            <LocationForm />
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment color="blue">
            <LocationList />
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default observer(LocationManager);
