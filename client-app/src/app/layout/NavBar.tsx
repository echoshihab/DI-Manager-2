import React, { useContext } from "react";
import { Icon, Menu, Sidebar, Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { RootStoreContext } from "../stores/rootStore";
import { admin } from "../helpers/util";

const NavBar = () => {
  const rootStore = useContext(RootStoreContext);
  const { user, logout } = rootStore.userStore;

  return (
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
      {user?.role === admin && (
        <Menu.Item as={NavLink} exact to="/admin">
          <Icon name="settings" />
          Admin
        </Menu.Item>
      )}
      {user && (
        <Menu.Item>
          <Button inverted color="red" onClick={() => logout()}>
            Log Out
          </Button>
        </Menu.Item>
      )}
    </Sidebar>
  );
};

export default NavBar;
