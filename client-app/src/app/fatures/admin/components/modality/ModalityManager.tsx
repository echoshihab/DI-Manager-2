import React, { useContext, useEffect, Fragment } from "react";
import ModalityForm from "./ModalityForm";
import ModalityList from "./ModalityList";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../../stores/rootStore";
import { Segment } from "semantic-ui-react";

const ModalityManager = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadModalities } = rootStore.modalityStore;

  useEffect(() => {
    loadModalities();
  }, [loadModalities]);

  return (
    <Fragment>
      <Segment floated="left">
        <ModalityForm />
      </Segment>
      <Segment floated="right">
        <ModalityList />
      </Segment>
    </Fragment>
  );
};

export default observer(ModalityManager);
