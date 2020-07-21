import React from "react";
import { Icon, Menu, Sidebar } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

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
    <Menu.Item as={NavLink} to="/dayview">
      <Icon name="calendar alternate outline" />
      Day
    </Menu.Item>
    <Menu.Item as={NavLink} to="/monthview">
      <Icon name="calendar outline" />
      Month
    </Menu.Item>
    <Menu.Item as={NavLink} exact to="/">
      <Icon name="sign in" />
      Sign In
    </Menu.Item>
  </Sidebar>
);

export default NavBar;
