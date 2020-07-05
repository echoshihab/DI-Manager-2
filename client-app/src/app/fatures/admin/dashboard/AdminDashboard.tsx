import React, { useState } from "react";
import TechnologistManager from "../components/technologist/TechnologistManager";
import LocationManager from "../components/location/LocationManager";
import RoomManager from "../components/room/RoomManager";
import ModalityManager from "../components/modality/ModalityManager";
import RoleManager from "../components/role/RoleManager";
import { Grid } from "semantic-ui-react";
import AdminNavBar from "../navigation/AdminNavBar";

const AdminDashboard = () => {
  const [visibleComponent, setVisibleComponent] = useState("");
  const [activeNavItem, setActiveNavItem] = useState<string>("");

  const handleComponentChange = (component: string) => {
    setActiveNavItem(component);
    setVisibleComponent(component);
  };

  const components = {
    technologist: <TechnologistManager />,
    location: <LocationManager />,
    room: <RoomManager />,
    modality: <ModalityManager />,
    role: <RoleManager />,
  } as {
    [key: string]: JSX.Element;
  };

  return (
    <Grid>
      <Grid.Column width={12} floated="right">
        {components.hasOwnProperty(visibleComponent) &&
          components[visibleComponent]}
      </Grid.Column>
      <Grid.Column floated="left">
        <AdminNavBar
          setComponent={handleComponentChange}
          activeItem={activeNavItem}
        />
      </Grid.Column>
    </Grid>
  );
};

export default AdminDashboard;
