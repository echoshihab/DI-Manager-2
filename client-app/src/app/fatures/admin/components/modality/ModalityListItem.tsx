import React, { useState, useContext, Fragment } from "react";
import { IModality } from "../../../../models/modality";
import { List, Button, Icon, Form } from "semantic-ui-react";
import { RootStoreContext } from "../../../../stores/rootStore";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../../api/common/form/TextInput";

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
    editModality(modality);
  };

  return (
    <List horizontal relaxed>
      <List.Item>
        <List.Content>
          {editMode ? (
            <FinalForm
              initialValues={modality}
              onSubmit={handleFinalFormSubmit}
              render={({ handleSubmit, invalid, pristine }) => (
                <Form onSubmit={handleSubmit} loading={loading}>
                  <Form.Group widths="equal">
                    <Field
                      name="name"
                      placeholder="Modality Name"
                      component={TextInput}
                      value={modality.name}
                    />
                    <Field
                      name="displayName"
                      placeholder="Modality Display Name"
                      component={TextInput}
                      value={modality.displayName}
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
            <Fragment>
              <List.Header as="a">{modality.name}</List.Header>
              <Button.Group>
                <Button onClick={toggleEditMode}>
                  <Icon name="edit" color="blue" />
                </Button>
                <Button onClick={() => deleteModality(modality.id)}>
                  <Icon name="trash alternate outline" color="red" />
                </Button>
              </Button.Group>
            </Fragment>
          )}
        </List.Content>
      </List.Item>
    </List>
  );
};

export default ModalityListItem;
