import React from "react";
import { Header, Icon, Image, Menu, Segment, Sidebar } from "semantic-ui-react";

const NavBar = () => (
  <Sidebar
    as={Menu}
    animation="overlay"
    icon="labeled"
    inverted
    vertical
    visible
    width="thin"
  >
    <Menu.Item as="a">
      <Icon name="home" />
      Home
    </Menu.Item>
    <Menu.Item as="a">
      <Icon name="calendar alternate outline" />
      Day
    </Menu.Item>
    <Menu.Item as="a">
      <Icon name="calendar outline" />
      Month
    </Menu.Item>
  </Sidebar>
);

export default NavBar;
