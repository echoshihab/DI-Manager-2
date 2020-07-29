import React, { useContext } from "react";
import { Icon, Menu, Sidebar, Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { RootStoreContext } from "../stores/rootStore";
import { admin } from "../helpers/util";
import { observer } from "mobx-react-lite";

const NavBar = () => {
  const rootStore = useContext(RootStoreContext);
  const { logout, user } = rootStore.userStore;
  const { role } = rootStore.commonStore;

  return (
    <Sidebar as={Menu} icon="labeled" inverted vertical visible width="thin">
      <Menu.Item as={NavLink} exact to="/">
        <Icon name="home" />
        Home
      </Menu.Item>
      <Menu.Item
        as={NavLink}
        to="/dayview"
        style={{ border: "1px solid black" }}
      >
        <Icon name="calendar alternate outline" />
        Day
      </Menu.Item>
      <Menu.Item as={NavLink} to="/monthview">
        <Icon name="calendar outline" />
        Month
      </Menu.Item>
      {role === admin && (
        <Menu.Item as={NavLink} to="/admin">
          <Icon name="settings" />
          Admin
        </Menu.Item>
      )}
      {user && (
        <Menu.Item>
          <Button inverted onClick={() => logout()}>
            Log Out
          </Button>
        </Menu.Item>
      )}
    </Sidebar>
  );
};

export default observer(NavBar);
