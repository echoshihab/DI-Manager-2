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
  const { loadLicenses } = rootStore.licenseStore;
  const { setAppLoaded, appLoaded } = rootStore.commonStore;
  const [techLoader, setTechLoader] = useState(false);

  useEffect(() => {
    loadModalities().finally(() => setAppLoaded());
  }, [loadModalities, setAppLoaded]);

  const handleModalityChange = (modalityId: string) => {
    setTechLoader(true);
    loadTechnologists(modalityId)
      .then(() => loadLicenses(modalityId))
      .finally(() => setTechLoader(false));
  };

  if (!appLoaded) return <LoadingComponent content="Loading app..." />;
  return (
    <Container style={{ width: "800px" }}>
      <Header
        as="h3"
        content="Manage Technologists"
        style={{ marginTop: ".5em" }}
        textAlign="center"
      />
      <Grid centered columns={1}>
        <Grid.Column>
          <Segment color="green" clearing>
            <TechnologistForm changeModality={handleModalityChange} />
          </Segment>
        </Grid.Column>
        <Grid.Column>
          {techLoader ? (
            <Grid.Column style={{ marginTop: "20px" }}>
              <LoadingComponent content="loading technologists.." />
            </Grid.Column>
          ) : (
            <Segment color="blue">
              <TechnologistList />
            </Segment>
          )}
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default observer(TechnologistManager);
