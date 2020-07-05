import React, { useState, useContext } from "react";
import { IRoomWithLocation, IRoom } from "../../../../models/room";
import { RootStoreContext } from "../../../../stores/rootStore";
import { combineValidators, isRequired } from "revalidate";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../../common/form/TextInput";
import { Form, Button, Icon, List } from "semantic-ui-react";
import LoadingComponent from "../../../../layout/LoadingComponent";
import { observer } from "mobx-react-lite";

interface IProps {
  room: IRoom;
}
const validate = combineValidators({
  name: isRequired({ message: "room name is required" }),
});

const RoomListItem: React.FC<IProps> = ({ room }) => {
  const rootStore = useContext(RootStoreContext);
  const { submitting, deleteRoom, editRoom } = rootStore.roomStore;
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleFinalFormSubmit = (room: IRoom) => {
    setLoading(true);
    editRoom(room)
      .then(() => setLoading(false))
      .finally(() => setEditMode(false));
  };

  const handleDeleteRoom = (id: string) => {
    setLoading(true);
    deleteRoom(id).finally(() => setLoading(false));
  };

  return editMode ? (
    <FinalForm
      validate={validate}
      initialValues={room}
      onSubmit={handleFinalFormSubmit}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form onSubmit={handleSubmit} loading={loading}>
          <Form.Group widths="equal">
            <Field
              name="name"
              component={TextInput}
              value={room.name}
              label="Name"
            />

            <Button
              loading={submitting}
              type="submit"
              disabled={loading || invalid || pristine}
            >
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
    <LoadingComponent content="Loading Rooms..." />
  ) : (
    <List horizontal>
      <List.Item>{room.name}</List.Item>
      <List.Item>
        <Button circular size="small" onClick={toggleEditMode}>
          <Icon name="edit" color="blue" />
        </Button>
      </List.Item>
      <List.Item>
        <Button circular size="small" onClick={() => handleDeleteRoom(room.id)}>
          <Icon name="trash alternate outline" color="red" />
        </Button>
      </List.Item>
    </List>
  );
};
export default observer(RoomListItem);
