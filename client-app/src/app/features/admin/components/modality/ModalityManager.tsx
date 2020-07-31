import React, { useContext, useEffect, useState } from "react";
import ModalityForm from "./ModalityForm";
import ModalityList from "./ModalityList";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../../stores/rootStore";
import { Segment, Grid, Container, Header } from "semantic-ui-react";
import LoadingComponent from "../../../../layout/LoadingComponent";

const ModalityManager = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadModalities } = rootStore.modalityStore;

  const [modalityLoader, setModalityLoader] = useState(true);

  useEffect(() => {
    loadModalities().finally(() => setModalityLoader(false));
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
          {modalityLoader ? (
            <Grid.Column style={{ marginTop: "20px" }}>
              <LoadingComponent content="loading rooms.." />
            </Grid.Column>
          ) : (
            <Segment color="blue">
              <ModalityList />
            </Segment>
          )}
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default observer(ModalityManager);
