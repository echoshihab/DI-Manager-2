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
  const { loadLicenses, clearLicenses } = rootStore.licenseStore;

  const [licenseLoader, setLicenseLoader] = useState(false);

  useEffect(() => {
    loadModalities();
    return () => {
      setLicenseLoader(true); //this fixes ui flicker issue on state update
      clearLicenses();
      setLicenseLoader(false);
    };
  }, [loadModalities, clearLicenses]);

  const handleModalityChange = (modalityId: string) => {
    setLicenseLoader(true);
    loadLicenses(modalityId).finally(() => setLicenseLoader(false));
  };

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
          {licenseLoader ? (
            <Grid.Column style={{ marginTop: "20px" }}>
              <LoadingComponent content="Loading Licenses..." />
            </Grid.Column>
          ) : (
            <Segment color="blue">
              <LicenseList />
            </Segment>
          )}
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default observer(LicenseManager);
