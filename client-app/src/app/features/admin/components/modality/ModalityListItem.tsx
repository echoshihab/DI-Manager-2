import React, { useState, useContext } from "react";
import { IModality } from "../../../../models/modality";
import { List, Button, Icon, Form, Label } from "semantic-ui-react";
import { RootStoreContext } from "../../../../stores/rootStore";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../../common/form/TextInput";
import { observer } from "mobx-react-lite";
import { combineValidators, isRequired } from "revalidate";
import LoadingComponent from "../../../../layout/LoadingComponent";

interface IProps {
  modality: IModality;
}
const validate = combineValidators({
  name: isRequired({ message: "Modality name is required" }),
  displayName: isRequired({ message: "Display name is required" }),
});

const ModalityListItem: React.FC<IProps> = ({ modality }) => {
  const rootStore = useContext(RootStoreContext);
  const { submitting, deleteModality, editModality } = rootStore.modalityStore;
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleFinalFormSubmit = (modality: IModality) => {
    setLoading(true);
    editModality(modality).finally(() => {
      setLoading(false);
      setEditMode(false);
    });
  };

  const handleDeleteModality = (id: string) => {
    setLoading(true);
    deleteModality(id).finally(() => setLoading(false));
  };

  return editMode ? (
    <FinalForm
      validate={validate}
      initialValues={modality}
      onSubmit={handleFinalFormSubmit}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form onSubmit={handleSubmit} loading={loading}>
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
          </Form.Group>
          <Form.Group inline>
            <Button
              fluid
              loading={submitting}
              disabled={loading || invalid || pristine}
              type="submit"
            >
              <Icon name="check" color="green" />
            </Button>
            <Button fluid onClick={toggleEditMode}>
              <Icon name="cancel" color="red" />
            </Button>
          </Form.Group>
        </Form>
      )}
    />
  ) : loading ? (
    <LoadingComponent content="Loading Modality List" />
  ) : (
    <List horizontal>
      <Label ribbon basic>
        <List.Item>
          <Button circular size="mini" onClick={toggleEditMode}>
            <Icon name="edit" color="blue" />
          </Button>

          <Button
            circular
            size="mini"
            onClick={() => handleDeleteModality(modality.id)}
          >
            <Icon name="trash alternate outline" color="red" />
          </Button>
        </List.Item>
      </Label>

      <Label size="large" basic color="black">
        <List.Item>
          {modality.name} {"(" + modality.displayName + ")"}
        </List.Item>
      </Label>
    </List>
  );
};

export default observer(ModalityListItem);
