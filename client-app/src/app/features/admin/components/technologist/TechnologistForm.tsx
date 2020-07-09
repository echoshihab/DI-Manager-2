import React, { useContext, useState } from "react";
import { combineValidators, isRequired } from "revalidate";
import { RootStoreContext } from "../../../../stores/rootStore";
import {
  TechnologistFormValues,
  ITechnologistLicenses,
} from "../../../../models/technologist";
import { v4 as uuid } from "uuid";
import { Form, Button } from "semantic-ui-react";
import { Form as FinalForm, Field } from "react-final-form";
import SelectInput from "../../../../common/form/SelectInput";
import TextInput from "../../../../common/form/TextInput";
import { IModality } from "../../../../models/modality";
import MultiSelectInput from "../../../../common/form/MultiSelectInput";
import { ILicense } from "../../../../models/license";
import { observer } from "mobx-react-lite";

interface IProps {
  changeModality: (modalityId: string) => void;
}
const validate = combineValidators({
  modality: isRequired({ message: "Location is required" }),
  name: isRequired({ message: "Name is required" }),
  initial: isRequired({ message: "Initial is required" }),
});

const TechnologistForm: React.FC<IProps> = ({ changeModality }) => {
  const rootStore = useContext(RootStoreContext);
  const { sortedModalitiesByDisplayName } = rootStore.modalityStore;
  const {
    sortedLicenseByName,
    selectLicense,
    license: selectedLicense,
  } = rootStore.licenseStore;
  const { createTechnologist } = rootStore.technologistStore;
  const technologist = new TechnologistFormValues();
  const [loading, setLoading] = useState(false);

  const handleFinalFormSubmit = (values: any, form: any) => {
    const { name, initial, modality, licenses } = values;

    let licenseArray: ITechnologistLicenses[] = [];
    licenses.forEach((license: string) => {
      selectLicense(license);
      console.log(selectedLicense);
      selectedLicense &&
        licenseArray.push({
          licenseId: selectedLicense.id,
          licenseDisplayName: selectedLicense.displayName,
        });
    });

    console.log(licenseArray);

    let newTechnologist = {
      id: uuid(),
      name: name,
      modalityId: modality,
      initial: initial,
      licenses: licenses,
    };

    setLoading(true);
    createTechnologist(newTechnologist)
      .then(() => form.restart())
      .finally(() => setLoading(false));
  };

  return (
    <FinalForm
      onSubmit={handleFinalFormSubmit}
      validate={validate}
      initialValues={technologist}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form onSubmit={handleSubmit} loading={loading}>
          <Field
            placeholder="Select a Modality"
            name="modality"
            value={technologist.modalityId}
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
            placeholder="Technologist Name"
            name="name"
            value={technologist.name}
            component={TextInput}
          />
          <Field
            placeholder="Technologist Initial"
            name="initial"
            value={technologist.initial}
            component={TextInput}
          />
          <Field
            placeholder="Technologist Licenses"
            name="licenses"
            value={[""]}
            multiple
            component={MultiSelectInput}
            options={sortedLicenseByName.map((license: ILicense) => {
              return {
                key: license.id,
                text: license.displayName,
                value: license.id,
              };
            })}
          />

          <Button
            floated="right"
            positive
            type="submit"
            content="Add Technologist"
            disabled={loading || invalid || pristine}
          />
        </Form>
      )}
    />
  );
};

export default observer(TechnologistForm);
