import React, { useContext, useEffect, Fragment } from "react";
import ModalityForm from "./ModalityForm";
import ModalityList from "./ModalityList";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../../stores/rootStore";
import { Segment, Grid, Container, Header } from "semantic-ui-react";

const ModalityManager = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadModalities } = rootStore.modalityStore;

  useEffect(() => {
    loadModalities();
  }, [loadModalities]);

  return (
    <Container style={{ width: "800px" }}>
      <Header
        as="h3"
        content="Manage Modalities"
        style={{ marginTop: ".5em" }}
        textAlign="center"
      />
      <Grid centered columns={1}>
        <Grid.Column>
          <Segment color="green" clearing>
            <ModalityForm />
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment color="blue">
            <ModalityList />
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default observer(ModalityManager);
