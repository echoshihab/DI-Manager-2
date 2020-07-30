import React, { useContext, useState, useEffect } from "react";
import { RootStoreContext } from "../../../../stores/rootStore";
import LoadingComponent from "../../../../layout/LoadingComponent";
import { Container, Header, Grid, Segment } from "semantic-ui-react";
import TechnologistList from "./TechnologistList";
import { observer } from "mobx-react-lite";
import TechnologistForm from "./TechnologistForm";
import { setReactionScheduler } from "mobx/lib/internal";
import { cleanup } from "@testing-library/react";

const TechnologistManager = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadModalities } = rootStore.modalityStore;
  const { loadTechnologists, clearTechnologists } = rootStore.technologistStore;
  const { loadLicenses } = rootStore.licenseStore;

  const [techLoader, setTechLoader] = useState(false);

  useEffect(() => {
    loadModalities();
    return () => {
      setTechLoader(true); //this loader takes care of the ui flicker from state update
      clearTechnologists();
      setTechLoader(false);
    };
  }, [loadModalities, clearTechnologists]);

  const handleModalityChange = (modalityId: string) => {
    setTechLoader(true);
    Promise.all([
      loadTechnologists(modalityId),
      loadLicenses(modalityId),
    ]).finally(() => setTechLoader(false));
  };

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
