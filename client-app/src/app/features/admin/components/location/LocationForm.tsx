import React, { useState, useContext } from "react";
import { Form, Button, Header } from "semantic-ui-react";
import TextInput from "../../../../common/form/TextInput";
import { Form as FinalForm, Field } from "react-final-form";
import { v4 as uuid } from "uuid";
import { RootStoreContext } from "../../../../stores/rootStore";
import { observer } from "mobx-react-lite";
import { combineValidators, isRequired } from "revalidate";
import { LocationFormValues } from "../../../../models/location";

const validate = combineValidators({
  name: isRequired({ message: "Location name is required" }),
});

const LocationForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { createLocation } = rootStore.locationStore;
  const location = new LocationFormValues();
  const [loading, setLoading] = useState(false);

  const handleFinalFormSubmit = (values: any, form: any) => {
    const { name } = values;

    let newLocation = {
      id: uuid(),
      name: name,
    };
    setLoading(true);
    createLocation(newLocation)
      .then(() => form.restart())
      .finally(() => setLoading(false));
  };

  return (
    <FinalForm
      onSubmit={handleFinalFormSubmit}
      validate={validate}
      initialValues={location}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form onSubmit={handleSubmit} loading={loading}>
          <Header content="Add New Location" />
          <Field
            placeholder="Location Name"
            name="name"
            value={location.name}
            component={TextInput}
          />

          <Button
            floated="right"
            positive
            type="submit"
            content="Add Location"
            disabled={loading || invalid || pristine}
          />
        </Form>
      )}
    />
  );
};

export default observer(LocationForm);
