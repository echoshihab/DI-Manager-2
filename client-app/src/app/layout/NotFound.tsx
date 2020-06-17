import React from "react";
import { Link } from "react-router-dom";
import { Segment, Header, Icon, Button } from "semantic-ui-react";

const NotFound = () => {
  return (
    <Segment size="massive" textAlign="center">
      <Header icon>
        <Icon name="search" />
        Page not found!
      </Header>
      <Segment.Inline>
        <Button as={Link} to="/" primary>
          Return to Home Page
        </Button>
      </Segment.Inline>
    </Segment>
  );
};

export default NotFound;
