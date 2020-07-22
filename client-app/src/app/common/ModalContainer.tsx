import React, { useContext } from "react";
import { Modal } from "semantic-ui-react";

import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../stores/rootStore";

const ModalContainer = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    modal: { open, body },
    closeModal,
  } = rootStore.modalStore;
  return (
    <Modal open={open} onClose={closeModal} size="small">
      <Modal.Content>{body}</Modal.Content>
    </Modal>
  );
};

export default observer(ModalContainer);
