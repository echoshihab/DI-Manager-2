import React, { useState, useContext } from "react";
import { Form, Button, Header } from "semantic-ui-react";
import TextInput from "../../../../api/common/form/TextInput";
import { Form as FinalForm, Field } from "react-final-form";
import { v4 as uuid } from "uuid";
import { RootStoreContext } from "../../../../stores/rootStore";
import { ModalityFormValues } from "../../../../models/modality";

const ModalityForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { createModality } = rootStore.modalityStore;
  const [modality, setModality] = useState(new ModalityFormValues());

  const handleFinalFormSubmit = (values: any) => {
    let newModality = {
      ...modality,
      id: uuid(),
    };
    createModality(newModality);
  };

  return (
    <FinalForm
      initialValues={modality}
      onSubmit={handleFinalFormSubmit}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form onSubmit={handleSubmit}>
          <Header content="Add New Modality" />
          <Field
            placeholder="Modality Name"
            name="modalityName"
            value={modality.name}
            component={TextInput}
          />
          <Field
            placeholder="Modality Display Name"
            name="modalityDisplayNAme"
            value={modality.displayName}
            component={TextInput}
          />

          <Button
            floated="right"
            positive
            type="submit"
            content="Add Modality"
            disabled={invalid || pristine}
          />
        </Form>
      )}
    />
  );
};

export default ModalityForm;
