import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Header } from "semantic-ui-react";
import TextInput from "../../../../api/common/form/TextInput";
import { Form as FinalForm, Field } from "react-final-form";
import { v4 as uuid } from "uuid";
import { RootStoreContext } from "../../../../stores/rootStore";
import { ModalityFormValues } from "../../../../models/modality";
import { observer } from "mobx-react-lite";

const ModalityForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { createModality } = rootStore.modalityStore;
  const [modality, setModality] = useState(new ModalityFormValues());
  const [loading, setLoading] = useState(false);

  const handleFinalFormSubmit = (values: any, form: any) => {
    console.log(values);
    const { name, displayName } = values;

    let newModality = {
      id: uuid(),
      name: name,
      displayName: displayName,
    };
    setLoading(true);
    createModality(newModality)
      .then(() => form.reset())
      .finally(() => setLoading(false));
  };

  return (
    <FinalForm
      onSubmit={handleFinalFormSubmit}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form onSubmit={handleSubmit} loading={loading}>
          <Header content="Add New Modality" />
          <Field
            placeholder="Modality Name"
            name="name"
            value={modality.name}
            component={TextInput}
          />
          <Field
            placeholder="Modality Display Name"
            name="displayName"
            value={modality.displayName}
            component={TextInput}
          />

          <Button
            floated="right"
            positive
            type="submit"
            content="Add Modality"
            disabled={loading || invalid || pristine}
          />
        </Form>
      )}
    />
  );
};

export default observer(ModalityForm);
