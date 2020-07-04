import React, { useContext, useState } from "react";
import { ILocation } from "../../../../models/location";
import { combineValidators, isRequired } from "revalidate";
import { RootStoreContext } from "../../../../stores/rootStore";
import { Form, Button, Icon, List } from "semantic-ui-react";
import { Form as FinalForm } from "react-final-form";
import { Field } from "react-final-form";
import TextInput from "../../../../api/common/form/TextInput";
import LoadingComponent from "../../../../layout/LoadingComponent";

interface IProps {
  location: ILocation;
}
const validate = combineValidators({
  name: isRequired({ message: "Location name is required" }),
});

const LocationListItem: React.FC<IProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { submitting, deleteLocation, editLocation } = rootStore.locationStore;
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

  const handleDeleteLocation = (id: string) => {
    setLoading(true);
    deleteLocation(id).finally(() => setLoading(false));
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

            <Button loading={submitting} type="submit">
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
    <LoadingComponent content="Loading Locations..." />
  ) : (
    <List horizontal>
      <List.Item>{location.name}</List.Item>
      <List.Item>
        <Button circular size="small" onClick={toggleEditMode}>
          <Icon name="edit" color="blue" />
        </Button>
      </List.Item>
      <List.Item>
        <Button
          circular
          size="small"
          onClick={() => handleDeleteLocation(location.id)}
        >
          <Icon name="trash alternate outline" color="red" />
        </Button>
      </List.Item>
    </List>
  );
};

export default LocationListItem;
