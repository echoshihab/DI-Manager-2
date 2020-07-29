import React, { useContext, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../../stores/rootStore";
import LoadingComponent from "../../../../layout/LoadingComponent";
import { Container, Header, Grid, Segment } from "semantic-ui-react";

import UserRoleList from "./UserList";

const UserManager = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadModalities } = rootStore.modalityStore;
  const { loadRoles, loadUsers } = rootStore.userStore;

  const [loader, setLoader] = useState(true);

  useEffect(() => {
    Promise.all([loadUsers(), loadRoles(), loadModalities()]).finally(() =>
      setLoader(false)
    );
  }, [loadRoles, setLoader, loadUsers, loadModalities]);

  if (loader) return <LoadingComponent content="Loading app..." />;
  return (
    <Container style={{ width: "800px" }}>
      <Header
        as="h3"
        content="Manage Users &amp; Roles"
        style={{ marginTop: ".5em" }}
        textAlign="center"
      />
      <Grid centered columns={1}>
        <Grid.Column>
          {loader ? (
            <Grid.Column style={{ marginTop: "20px" }}>
              <LoadingComponent content="loading Users &amp; Roles.." />
            </Grid.Column>
          ) : (
            <Segment color="blue">
              <UserRoleList />
            </Segment>
          )}
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default observer(UserManager);
