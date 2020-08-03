import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../../stores/rootStore";
import { List, Header } from "semantic-ui-react";
import TechnologistListItem from "./TechnologistListItem";

const TechnologistList = () => {
  const rootStore = useContext(RootStoreContext);
  const { sortedTechnologistByInitial } = rootStore.technologistStore;

  return (
    <List divided relaxed>
      <Header content="Available Technologists" />

      {sortedTechnologistByInitial.map((technologist) => (
        <List.Item key={technologist.id}>
          <List.Content>
            <TechnologistListItem technologist={technologist} />
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

export default observer(TechnologistList);
