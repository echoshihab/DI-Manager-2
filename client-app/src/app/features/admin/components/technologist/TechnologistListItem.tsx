import React, { useContext, useState } from "react";
import { combineValidators, isRequired } from "revalidate";
import {
  ITechnologist,
  ITechnologistEdit,
} from "../../../../models/technologist";
import { RootStoreContext } from "../../../../stores/rootStore";
import { Form, Button, Icon, List, Label } from "semantic-ui-react";
import LoadingComponent from "../../../../layout/LoadingComponent";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../../common/form/TextInput";
import { observer } from "mobx-react-lite";
import { ILicense } from "../../../../models/license";
import MultiSelectInput from "../../../../common/form/MultiSelectInput";

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
  const { sortedLicenseByName } = rootStore.licenseStore;
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleFinalFormSubmit = (values: any, form: any) => {
    const { name, initial, licenses_mod: licenseIdList } = values;

    let updatedTechnologist: ITechnologistEdit = {
      id: technologist.id,
      name: name,
      initial: initial,
      licenseIdList: licenseIdList,
    };

    setLoading(true);
    editTechnologist(updatedTechnologist)
      .then(() => setLoading(false))
      .finally(() => setEditMode(false));
  };

  const handleDeleteTechnologist = (id: string) => {
    setLoading(true);
    deleteTechnologist(id).finally(() => setLoading(false));
  };

  const currentLicenses = technologist.licenses.map((l) => l.licenseId);

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
              name="initial"
              component={TextInput}
              value={technologist.initial}
              label="Initial"
            />
          </Form.Group>

          <Form.Group widths="equal" inline>
            <Label size="large" ribbon>
              Licenses:{" "}
            </Label>
            <Field
              name="licenses_mod"
              multiple
              defaultValue={currentLicenses}
              component={MultiSelectInput}
              options={sortedLicenseByName.map((license: ILicense) => {
                return {
                  key: license.id,
                  text: license.displayName,
                  value: license.id,
                };
              })}
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
    <LoadingComponent content="Loading technologists..." />
  ) : (
    <List horizontal>
      <List.Item>
        <Label ribbon basic>
          <Button circular size="mini" onClick={toggleEditMode} outline="black">
            <Icon name="edit" color="blue" />
          </Button>
          <Button
            circular
            size="mini"
            onClick={() => handleDeleteTechnologist(technologist.id)}
          >
            <Icon name="trash alternate outline" color="red" />
          </Button>
        </Label>
      </List.Item>
      <List.Item>
        <Label size="large" basic color="black">
          <Icon name="user circle outline" />
          {technologist.name} {"(" + technologist.initial + ") "}
          {technologist.licenses &&
            technologist.licenses.map((t) => (
              <Label key={t.licenseId} basic circular color="black">
                <Icon name="drivers license" />
                {t.licenseDisplayName}
              </Label>
            ))}
        </Label>
      </List.Item>

      <List.Item></List.Item>
    </List>
  );
};

export default observer(TechnologistListItem);
