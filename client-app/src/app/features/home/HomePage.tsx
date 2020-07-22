import React, { useContext } from "react";
import {
  Grid,
  Container,
  Header,
  Icon,
  Card,
  Button,
  Divider,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import LoginForm from "../user/LoginForm";
import { RootStoreContext } from "../../stores/rootStore";

const HomePage = () => {
  const rootStore = useContext(RootStoreContext);
  const { openModal } = rootStore.modalStore;

  return (
    <Container
      fluid
      style={{
        background: "#2185d0",
        height: "100vh",
      }}
    >
      <Grid columns={1}>
        <Grid.Column
          style={{
            height: "80vh",
            background: `#2185d0`,

            backgroundSize: "cover",
            backgroundBlendMode: "darken",
            backdropFilter: "brightness(50%)",
          }}
        >
          <Grid.Row style={{ backgroundColor: "white" }}>
            <Card.Group centered style={{ marginTop: "10vh" }}>
              <Card as={Link} to="/dayview" centered>
                <Card.Content>
                  <Card.Header textAlign="center">
                    Day View <Icon name="calendar alternate outline" />
                  </Card.Header>
                </Card.Content>
                <Card.Content
                  extra
                  textAlign="center"
                  style={{ backgroundColor: "#2185d0", color: "white" }}
                >
                  <strong>View Schedules By Day</strong>
                </Card.Content>
              </Card>
              <Card onClick={() => console.log("test")} centered>
                <Card.Content>
                  <Card.Header textAlign="center">
                    Month View <Icon name="calendar outline" />
                  </Card.Header>
                </Card.Content>
                <Card.Content
                  extra
                  textAlign="center"
                  style={{ backgroundColor: "#2185d0", color: "white" }}
                >
                  <strong>View Schedules By Month</strong>
                </Card.Content>
              </Card>
            </Card.Group>
          </Grid.Row>
          <Grid.Row style={{ backgroundColor: "white" }}>
            <Divider style={{ backgroundColor: "#2185d0" }} />

            <Card centered style={{ marginTop: "10vh" }}>
              <Card.Content>
                <Card.Header textAlign="center">
                  Administration <Icon name="settings" />
                </Card.Header>

                <Card.Description textAlign="center">
                  <strong>Coordinators &amp; Admins</strong>
                </Card.Description>
              </Card.Content>
              <Card.Content extra textAlign="center">
                <Button.Group>
                  <Button color="blue" onClick={() => openModal(<LoginForm />)}>
                    Login
                  </Button>
                  <Button.Or />
                  <Button positive>Sign up</Button>
                </Button.Group>
              </Card.Content>
            </Card>
            <Divider style={{ backgroundColor: "#2185d0" }} />
          </Grid.Row>
        </Grid.Column>
      </Grid>
      <Divider style={{ border: "3px solid white" }} />
      <Header textAlign="center" size="huge" style={{ color: "white" }}>
        Fictional Diagnostic Imaging Company
        <Icon name="user doctor" style={{ color: "white" }} />
      </Header>
    </Container>
  );
};

export default HomePage;
