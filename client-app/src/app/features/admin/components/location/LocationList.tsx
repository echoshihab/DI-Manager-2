import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../../stores/rootStore";
import { List, Header } from "semantic-ui-react";
import LocationListItem from "./LocationListItem";

const LocationList = () => {
  const rootStore = useContext(RootStoreContext);
  const { sortedLocationByName } = rootStore.locationStore;

  return (
    <List divided relaxed>
      <Header content="List of Locations" />

      {sortedLocationByName.map((location) => (
        <List.Item key={location.id}>
          <List.Content>
            <LocationListItem location={location} />
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

export default observer(LocationList);
