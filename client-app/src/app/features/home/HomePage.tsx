import React from "react";
import { Grid, Container, Header, Icon, Card, Button } from "semantic-ui-react";
import background from "../../../images/background.jpg";

const HomePage = () => {
  return (
    <Container fluid>
      <Grid columns={1}>
        <Grid.Column
          style={{
            height: "80vh",
            background: `linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(${background}) `,

            backgroundSize: "cover",
            backgroundBlendMode: "darken",
            backdropFilter: "brightness(50%)",
          }}
        >
          <Grid.Row>
            <Card.Group centered style={{ marginTop: "10vh" }}>
              <Card onClick={() => console.log("test")} centered>
                <Card.Content>
                  <Card.Header textAlign="center">
                    Day View <Icon name="calendar alternate outline" />
                  </Card.Header>
                </Card.Content>
                <Card.Content
                  extra
                  textAlign="center"
                  style={{ backgroundColor: "black", color: "white" }}
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
                  style={{ backgroundColor: "black", color: "white" }}
                >
                  <strong>View Schedules By Month</strong>
                </Card.Content>
              </Card>
            </Card.Group>
          </Grid.Row>
          <Grid.Row>
            <Card centered>
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
                  <Button color="blue">Login</Button>
                  <Button.Or />
                  <Button positive>Sign up</Button>
                </Button.Group>
              </Card.Content>
            </Card>
          </Grid.Row>
        </Grid.Column>
      </Grid>
      <Header textAlign="center" size="huge">
        Fictional Diagnostic Imaging Company
        <Icon name="user doctor" />
      </Header>
    </Container>
  );
};

export default HomePage;
