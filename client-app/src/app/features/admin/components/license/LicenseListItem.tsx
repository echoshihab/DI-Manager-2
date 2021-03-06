import React, { useState, useContext } from "react";
import { RootStoreContext } from "../../../../stores/rootStore";
import { combineValidators, isRequired } from "revalidate";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../../common/form/TextInput";
import { Form, Button, Icon, List, Label } from "semantic-ui-react";
import LoadingComponent from "../../../../layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import { ILicense } from "../../../../models/license";

interface IProps {
  license: ILicense;
}
const validate = combineValidators({
  name: isRequired({ message: "license name is required" }),
  displayName: isRequired({ message: "display name is required" }),
});

const LicenseListItem: React.FC<IProps> = ({ license }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    submitting,
    deleteLicense,
    editLicense,
    targetLicense,
  } = rootStore.licenseStore;
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleFinalFormSubmit = (license: ILicense) => {
    setLoading(true);
    editLicense(license)
      .then(() => setLoading(false))
      .finally(() => setEditMode(false));
  };

  return editMode ? (
    <FinalForm
      validate={validate}
      initialValues={license}
      onSubmit={handleFinalFormSubmit}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form onSubmit={handleSubmit} loading={loading}>
          <Form.Group widths="equal">
            <Field
              name="name"
              component={TextInput}
              value={license.name}
              label="Name"
            />
            <Field
              name="displayName"
              component={TextInput}
              value={license.displayName}
              label="Display Name"
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
    <LoadingComponent content="Loading Licenses..." />
  ) : (
    <List horizontal>
      <List.Item>
        <Label ribbon basic>
          <Button circular size="mini" onClick={toggleEditMode}>
            <Icon name="edit" color="blue" />
          </Button>
          <Button
            name={license.id}
            circular
            size="mini"
            loading={targetLicense === license.id}
            onClick={(e) => deleteLicense(e, license.id)}
          >
            <Icon
              name="trash alternate outline"
              color={targetLicense === license.id ? "grey" : "red"}
            />
          </Button>
        </Label>
      </List.Item>
      <Label size="large" basic color="black">
        <List.Item>{license.name + ` (${license.displayName})`} </List.Item>
      </Label>
    </List>
  );
};
export default observer(LicenseListItem);
