import React, { useContext, useState } from "react";
import { combineValidators, isRequired } from "revalidate";
import { ITechnologist } from "../../../../models/technologist";
import { RootStoreContext } from "../../../../stores/rootStore";
import { Form, Button, Icon, List } from "semantic-ui-react";
import LoadingComponent from "../../../../layout/LoadingComponent";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../../common/form/TextInput";
import { observer } from "mobx-react-lite";

interface IProps {
  technologist: ITechnologist;
}
const validate = combineValidators({
  name: isRequired({ message: "technologist name is required" }),
  initial: isRequired({ message: "technologist initial is required" }),
});

const TechnologistListItem: React.FC<IProps> = ({ technologist }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    submitting,
    deleteTechnologist,
    editTechnologist,
  } = rootStore.technologistStore;
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleFinalFormSubmit = (technologist: ITechnologist) => {
    setLoading(true);
    editTechnologist(technologist)
      .then(() => setLoading(false))
      .finally(() => setEditMode(false));
  };

  const handleDeleteTechnologist = (id: string) => {
    setLoading(true);
    deleteTechnologist(id).finally(() => setLoading(false));
  };

  return editMode ? (
    <FinalForm
      validate={validate}
      initialValues={technologist}
      onSubmit={handleFinalFormSubmit}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form onSubmit={handleSubmit} loading={loading}>
          <Form.Group widths="equal">
            <Field
              name="name"
              component={TextInput}
              value={technologist.name}
              label="Name"
            />
            <Field
              name="name"
              component={TextInput}
              value={technologist.initial}
              label="Name"
            />

            <Button
              loading={submitting}
              type="submit"
              disabled={loading || invalid || pristine}
            >
              <Icon name="check" color="green" />
            </Button>
            <Button onClick={toggleEditMode}>
              <Icon name="cancel" color="red" />
            </Button>
          </Form.Group>
        </Form>
      )}
    />
  ) : loading ? (
    <LoadingComponent content="Loading technologists..." />
  ) : (
    <List horizontal>
      <List.Item>
        {technologist.name} {"(" + technologist.initial + ")"}
      </List.Item>
      <List.Item>
        <Button circular size="small" onClick={toggleEditMode}>
          <Icon name="edit" color="blue" />
        </Button>
      </List.Item>
      <List.Item>
        <Button
          circular
          size="small"
          onClick={() => handleDeleteTechnologist(technologist.id)}
        >
          <Icon name="trash alternate outline" color="red" />
        </Button>
      </List.Item>
    </List>
  );
};

export default observer(TechnologistListItem);
