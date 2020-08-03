import React, { useContext, useState } from "react";
import { ILocation } from "../../../../models/location";
import { combineValidators, isRequired } from "revalidate";
import { RootStoreContext } from "../../../../stores/rootStore";
import { Form, Button, Icon, List, Label } from "semantic-ui-react";
import { Form as FinalForm } from "react-final-form";
import { Field } from "react-final-form";
import TextInput from "../../../../common/form/TextInput";
import LoadingComponent from "../../../../layout/LoadingComponent";
import { observer } from "mobx-react-lite";

interface IProps {
  location: ILocation;
}
const validate = combineValidators({
  name: isRequired({ message: "Location name is required" }),
});

const LocationListItem: React.FC<IProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    submitting,
    deleteLocation,
    editLocation,
    targetLocation,
  } = rootStore.locationStore;
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleFinalFormSubmit = (location: ILocation) => {
    setLoading(true);
    editLocation(location)
      .then(() => setLoading(false))
      .finally(() => setEditMode(false));
  };

  return editMode ? (
    <FinalForm
      validate={validate}
      initialValues={location}
      onSubmit={handleFinalFormSubmit}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form onSubmit={handleSubmit} loading={loading}>
          <Form.Group widths="equal">
            <Field
              name="name"
              component={TextInput}
              value={location.name}
              label="Name"
            />
          </Form.Group>

          <Form.Group inline>
            <Button
              fluid
              loading={submitting}
              type="submit"
              disabled={loading || invalid || pristine}
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
    <LoadingComponent content="Loading Locations..." />
  ) : (
    <List horizontal>
      <List.Item>
        <Label ribbon basic>
          <Button circular size="mini" onClick={toggleEditMode}>
            <Icon name="edit" color="blue" />
          </Button>

          <Button
            circular
            name={location.id}
            size="mini"
            loading={targetLocation === location.id}
            onClick={(e) => deleteLocation(e, location.id)}
          >
            <Icon
              name="trash alternate outline"
              color={targetLocation === location.id ? "grey" : "red"}
            />
          </Button>
        </Label>
      </List.Item>
      <Label size="large" basic color="black">
        <List.Item>{location.name}</List.Item>
      </Label>
    </List>
  );
};

export default observer(LocationListItem);
