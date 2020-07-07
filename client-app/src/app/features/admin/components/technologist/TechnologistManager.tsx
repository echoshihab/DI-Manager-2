import React, { useContext, useState, useEffect } from "react";
import { RootStoreContext } from "../../../../stores/rootStore";
import LoadingComponent from "../../../../layout/LoadingComponent";
import { Container, Header, Grid, Segment } from "semantic-ui-react";
import RoomForm from "../room/RoomForm";
import TechnologistList from "./TechnologistList";
import { observer } from "mobx-react-lite";
import TechnologistForm from "./TechnologistForm";

const TechnologistManager = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadModalities } = rootStore.modalityStore;
  const { loadTechnologists } = rootStore.technologistStore;
  const { setAppLoaded, appLoaded } = rootStore.commonStore;

  const [technologists, setTechnologists] = useState(false);

  useEffect(() => {
    loadModalities().finally(() => setAppLoaded());
  }, [loadModalities, setAppLoaded]);

  const handleModalityChange = (modalityId: string) => {
    loadTechnologists(modalityId).then(() => setTechnologists(true));
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
            <TechnologistForm />
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment color="blue">
            {technologists && <TechnologistList />}
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default observer(TechnologistManager);
