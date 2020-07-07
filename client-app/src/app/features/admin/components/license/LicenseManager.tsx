import React, { useContext, useEffect, useState } from "react";
import { RootStoreContext } from "../../../../stores/rootStore";
import LoadingComponent from "../../../../layout/LoadingComponent";
import { Container, Header, Grid, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import LicenseList from "./LicenseList";
import LicenseForm from "./LicenseForm";

const LicenseManager = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadModalities } = rootStore.modalityStore;
  const { loadLicenses } = rootStore.licenseStore;
  const { setAppLoaded, appLoaded } = rootStore.commonStore;

  const [licenses, setLicenses] = useState(false);

  useEffect(() => {
    loadModalities().finally(() => setAppLoaded());
  }, [loadModalities, setAppLoaded]);

  const handleModalityChange = (modalityId: string) => {
    setLicenses(false);
    loadLicenses(modalityId).then(() => setLicenses(true));
  };

  if (!appLoaded) return <LoadingComponent content="Loading app..." />;
  return (
    <Container style={{ width: "800px" }}>
      <Header
        as="h3"
        content="Manage Licenses"
        style={{ marginTop: ".5em" }}
        textAlign="center"
      />
      <Grid centered columns={1}>
        <Grid.Column>
          <Segment color="green" clearing>
            <LicenseForm changeModality={handleModalityChange} />
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment color="blue">{licenses && <LicenseList />}</Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default observer(LicenseManager);
