import React, { useContext, useState } from "react";
import { combineValidators, isRequired } from "revalidate";
import { RootStoreContext } from "../../../../stores/rootStore";
import {
  TechnologistFormValues,
  ITechnologistForm,
} from "../../../../models/technologist";
import { v4 as uuid } from "uuid";
import { Form, Button, Segment } from "semantic-ui-react";
import { Form as FinalForm, Field } from "react-final-form";
import SelectInput from "../../../../common/form/SelectInput";
import TextInput from "../../../../common/form/TextInput";
import { IModality } from "../../../../models/modality";
import MultiSelectInput from "../../../../common/form/MultiSelectInput";
import { ILicense } from "../../../../models/license";
import { observer } from "mobx-react-lite";
import { FORM_ERROR } from "final-form";
import ErrorMessage from "../../../../common/form/ErrorMessage";

interface IProps {
  changeModality: (modalityId: string) => void;
}
const validate = combineValidators({
  modality: isRequired({ message: "modality is required" }),
  name: isRequired({ message: "Name is required" }),
  initial: isRequired({ message: "Initial is required" }),
});

const TechnologistForm: React.FC<IProps> = ({ changeModality }) => {
  const rootStore = useContext(RootStoreContext);
  const { sortedModalitiesByDisplayName } = rootStore.modalityStore;
  const { sortedLicenseByName } = rootStore.licenseStore;
  const { createTechnologist } = rootStore.technologistStore;
  const technologist = new TechnologistFormValues();
  const [loading, setLoading] = useState(false);

  const handleFinalFormSubmit = async (values: any, form: any) => {
    let errors: any;
    const { name, initial, modality, licenses: licenseIdList } = values;

    let newTechnologist: ITechnologistForm = {
      id: uuid(),
      name: name,
      modalityId: modality,
      initial: initial,
      licenseIdList: licenseIdList,
    };

    setLoading(true);
    await createTechnologist(newTechnologist)
      .then(() => setTimeout(form.restart))
      .catch((error) => {
        errors = error;
        return errors;
      })
      .finally(() => {
        setLoading(false);
      });

    return { [FORM_ERROR]: errors };
  };

  return (
    <FinalForm
      onSubmit={handleFinalFormSubmit}
      validate={validate}
      initialValues={technologist}
      render={({
        handleSubmit,
        invalid,
        pristine,
        submitError,
        dirtySinceLastSubmit,
      }) => (
        <Form onSubmit={handleSubmit} loading={loading} error>
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage error={submitError} />
          )}
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
            disabled={(invalid && !dirtySinceLastSubmit) || pristine || loading}
          />
        </Form>
      )}
    />
  );
};

export default observer(TechnologistForm);
