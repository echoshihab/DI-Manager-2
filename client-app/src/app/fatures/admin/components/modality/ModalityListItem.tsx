import React, { useState, useContext, Fragment, useEffect } from "react";
import { IModality } from "../../../../models/modality";
import { List, Button, Icon, Form, Label } from "semantic-ui-react";
import { RootStoreContext } from "../../../../stores/rootStore";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../../api/common/form/TextInput";
import { listenerCount } from "process";
import { observer } from "mobx-react-lite";

interface IProps {
  modality: IModality;
}

const ModalityListItem: React.FC<IProps> = ({ modality }) => {
  const rootStore = useContext(RootStoreContext);
  const { submitting, deleteModality, editModality } = rootStore.modalityStore;
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleFinalFormSubmit = (modality: IModality) => {
    console.log(modality);
    editModality(modality);
    setEditMode(false);
  };

  return editMode ? (
    <FinalForm
      initialValues={modality}
      onSubmit={handleFinalFormSubmit}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Group widths="equal">
            <Field
              name="name"
              component={TextInput}
              value={modality.name}
              label="Name"
            />

            <Field
              name="displayName"
              component={TextInput}
              value={modality.displayName}
              label="Display Name"
            />
            <Button loading={submitting} type="submit">
              <Icon name="check" />
            </Button>
            <Button onClick={toggleEditMode}>
              <Icon name="cancel" />
            </Button>
          </Form.Group>
        </Form>
      )}
    />
  ) : (
    <List horizontal>
      <List.Item>
        {modality.name} {"(" + modality.displayName + ")"}
      </List.Item>
      <List.Item>
        <Button circular compact onClick={toggleEditMode}>
          <Icon name="edit" color="blue" />
        </Button>
      </List.Item>
      <List.Item>
        <Button circular compact onClick={() => deleteModality(modality.id)}>
          <Icon name="trash alternate outline" color="red" />
        </Button>
      </List.Item>
    </List>
  );
};

export default observer(ModalityListItem);
