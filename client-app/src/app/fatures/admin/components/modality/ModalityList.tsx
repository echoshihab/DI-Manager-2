import React, { useContext } from "react";
import { List } from "semantic-ui-react";
import { RootStoreContext } from "../../../../stores/rootStore";
import { observer } from "mobx-react-lite";
import ModalityListItem from "./ModalityListItem";

const ModalityList = () => {
  const rootStore = useContext(RootStoreContext);
  const { sortedModalitiesByDisplayName } = rootStore.modalityStore;

  return (
    <List divided relaxed>
      {sortedModalitiesByDisplayName.map((modality) => (
        <List.Item>
          <List.Content>
            <List.Header>List of Modalities</List.Header>
            <ModalityListItem modality={modality} />
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

export default observer(ModalityList);
