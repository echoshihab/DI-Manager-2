import React from "react";
import { Menu, Header } from "semantic-ui-react";

interface IProps {
  setComponent: (target: string) => void;
  activeItem: string;
}

const AdminNavBar: React.FC<IProps> = ({ setComponent, activeItem }) => {
  return (
    <Menu vertical>
      <Menu.Item
        name="technologist"
        active={activeItem === "technologist"}
        onClick={(e, { name }) => setComponent(name!)}
      >
        <Header as="h4">Technologist </Header>
        <p>Manage Technologists</p>
      </Menu.Item>

      <Menu.Item
        name="license"
        active={activeItem === "license"}
        onClick={(e, { name }) => setComponent(name!)}
      >
        <Header as="h4">License </Header>
        <p>Manage Licenses</p>
      </Menu.Item>

      <Menu.Item
        name="location"
        active={activeItem === "location"}
        onClick={(e, { name }) => setComponent(name!)}
      >
        <Header as="h4">Location </Header>
        <p>Manage Locations</p>
      </Menu.Item>
      <Menu.Item
        name="room"
        active={activeItem === "room"}
        onClick={(e, { name }) => setComponent(name!)}
      >
        <Header as="h4">Room </Header>
        <p>Manage Rooms</p>
      </Menu.Item>
      <Menu.Item
        name="modality"
        active={activeItem === "modality"}
        onClick={(e, { name }) => setComponent(name!)}
      >
        <Header as="h4">Modality </Header>
        <p>Manage Modalities</p>
      </Menu.Item>
      <Menu.Item
        name="role"
        active={activeItem === "role"}
        onClick={(e, { name }) => setComponent(name!)}
      >
        <Header as="h4">Roles </Header>
        <p>Manage Roles</p>
      </Menu.Item>
    </Menu>
  );
};

export default AdminNavBar;
