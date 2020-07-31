import React, { useState, useContext } from "react";
import { IUserSlim } from "../../../../models/user";
import LoadingComponent from "../../../../layout/LoadingComponent";
import { combineValidators, isRequired } from "revalidate";
import { RootStoreContext } from "../../../../stores/rootStore";
import { Form, Label, Button, Icon, List, Header } from "semantic-ui-react";
import { Field, Form as FinalForm } from "react-final-form";
import { observer } from "mobx-react-lite";
import SelectInput from "../../../../common/form/SelectInput";
import { IModality } from "../../../../models/modality";

interface IProps {
  user: IUserSlim;
}
const validate = combineValidators({
  modalityId: isRequired({ message: "Modality is required" }),
});

const UserListItem: React.FC<IProps> = ({ user }) => {
  const rootStore = useContext(RootStoreContext);
  const { sortedModalitiesByDisplayName } = rootStore.modalityStore;
  const { roles, updateUser } = rootStore.userStore;
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleFinalFormSubmit = (values: any, form: any) => {
    const { modalityId, role } = values;

    let updatedUser: IUserSlim = {
      userName: user.userName,
      modalityId: modalityId,
      role: role,
    };
    setLoading(true);
    updateUser(updatedUser)
      .then(() => form.restart())
      .finally(() => {
        setLoading(false);
        toggleEditMode();
      });
  };

  const userModalityDetail: IModality = sortedModalitiesByDisplayName.filter(
    (m: IModality) => m.id === user.modalityId
  )[0];

  return editMode ? (
    <FinalForm
      validate={validate}
      initialValues={user}
      onSubmit={handleFinalFormSubmit}
      render={({ handleSubmit, invalid, pristine, submitting }) => (
        <Form onSubmit={handleSubmit} loading={loading}>
          <Form.Group widths="equal" inline>
            <Label ribbon basic size="large">
              <Icon name="user" /> {user.userName.toUpperCase()}
            </Label>
            <Label size="large" style={{ marginLeft: "10px" }}>
              Modality:
            </Label>
            <Field
              name="modalityId"
              defaultValue={user.modalityId}
              placeholder={"Select a modality"}
              component={SelectInput}
              options={sortedModalitiesByDisplayName.map(
                (modality: IModality) => {
                  return {
                    key: modality.id,
                    text: modality.displayName,
                    value: modality.id,
                  };
                }
              )}
            />

            <Label size="large">Role:</Label>
            <Field
              name="role"
              defaultValue={user.role}
              component={SelectInput}
              options={roles.map((role: string) => {
                return {
                  key: role,
                  text: role,
                  value: role,
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
    <LoadingComponent content="Loading User &amp; roles..." />
  ) : (
    <List horizontal>
      <List.Item>
        <Label ribbon basic>
          <Button circular size="mini" onClick={toggleEditMode} outline="black">
            <Icon name="edit" color="blue" />
          </Button>
        </Label>
      </List.Item>
      <List.Item>
        <Header size="small">
          {user.userName.toUpperCase()}

          <Label basic circular color="black">
            <Icon name="drivers license" />
            {user.role}
          </Label>
          {userModalityDetail ? (
            <Label basic circular color="black">
              {userModalityDetail.displayName}
            </Label>
          ) : (
            ""
          )}
        </Header>
      </List.Item>

      <List.Item></List.Item>
    </List>
  );
};

export default observer(UserListItem);
