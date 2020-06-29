import React, { useContext } from "react";
import { List, Header } from "semantic-ui-react";
import { RootStoreContext } from "../../../../stores/rootStore";
import { observer } from "mobx-react-lite";
import ModalityListItem from "./ModalityListItem";

const ModalityList = () => {
  const rootStore = useContext(RootStoreContext);
  const { sortedModalitiesByDisplayName } = rootStore.modalityStore;

  return (
    <List divided relaxed>
      <Header content="List of Modalities" />

      {sortedModalitiesByDisplayName.map((modality) => (
        <List.Item key={modality.id}>
          <List.Content>
            <ModalityListItem modality={modality} />
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

export default observer(ModalityList);
