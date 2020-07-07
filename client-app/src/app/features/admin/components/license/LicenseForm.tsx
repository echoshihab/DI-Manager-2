import React, { useContext, useState } from "react";
import { combineValidators, isRequired } from "revalidate";
import { RootStoreContext } from "../../../../stores/rootStore";
import { RoomFormValues } from "../../../../models/room";
import { Form, Header, Button } from "semantic-ui-react";
import { Field, Form as FinalForm } from "react-final-form";
import { v4 as uuid } from "uuid";
import TextInput from "../../../../common/form/TextInput";
import SelectInput from "../../../../common/form/SelectInput";
import { ILocation } from "../../../../models/location";
import { LicenseFormValues } from "../../../../models/license";
import { IModality } from "../../../../models/modality";

interface IProps {
  changeModality: (modalityId: string) => void;
}
const validate = combineValidators({
  modality: isRequired({ message: "Modality is required" }),
  name: isRequired({ message: "Name is required" }),
  displayName: isRequired({ message: "Display name is required" }),
});

const LicenseForm: React.FC<IProps> = ({ changeModality }) => {
  const rootStore = useContext(RootStoreContext);
  const { sortedModalitiesByDisplayName } = rootStore.modalityStore;
  const { createLicense } = rootStore.licenseStore;
  const license = new LicenseFormValues();
  const [loading, setLoading] = useState(false);

  const handleFinalFormSubmit = (values: any, form: any) => {
    const { name, displayName, modality } = values;

    let newLicense = {
      id: uuid(),
      name: name,
      displayName: displayName,
      modalityId: modality,
    };
    setLoading(true);

    createLicense(newLicense)
      .then(() => form.restart())
      .finally(() => setLoading(false));
  };

  return (
    <FinalForm
      onSubmit={handleFinalFormSubmit}
      validate={validate}
      initialValues={license}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form onSubmit={handleSubmit} loading={loading}>
          <Field
            placeholder="Select a Modality"
            name="modality"
            value={license.modalityId}
            options={sortedModalitiesByDisplayName.map(
              (modality: IModality) => {
                return {
                  key: modality.id,
                  text: modality.displayName,
                  value: modality.id,
                };
              }
            )}
            component={SelectInput}
            inputOnChange={changeModality}
          />
          <Field
            placeholder="License Name"
            name="name"
            value={license.name}
            component={TextInput}
          />
          <Field
            placeholder="Display Name"
            name="displayName"
            value={license.name}
            component={TextInput}
          />

          <Button
            floated="right"
            positive
            type="submit"
            content="Add License"
            disabled={loading || invalid || pristine}
          />
        </Form>
      )}
    />
  );
};

export default LicenseForm;
