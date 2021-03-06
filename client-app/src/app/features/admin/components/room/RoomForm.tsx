import React, { useContext, useState } from "react";
import { combineValidators, isRequired } from "revalidate";
import { RootStoreContext } from "../../../../stores/rootStore";
import { RoomFormValues } from "../../../../models/room";
import { Form, Button } from "semantic-ui-react";
import { Field, Form as FinalForm } from "react-final-form";
import { v4 as uuid } from "uuid";
import TextInput from "../../../../common/form/TextInput";
import SelectInput from "../../../../common/form/SelectInput";
import { ILocation } from "../../../../models/location";
import { observer } from "mobx-react-lite";
import { FormApi } from "final-form";

interface IProps {
  changeLocation: (locationId: string) => void;
}
const validate = combineValidators({
  location: isRequired({ message: "Location is required" }),
  name: isRequired({ message: "Room name is required" }),
});

const RoomForm: React.FC<IProps> = ({ changeLocation }) => {
  const rootStore = useContext(RootStoreContext);
  const { sortedLocationByName } = rootStore.locationStore;
  const { createRoom } = rootStore.roomStore;
  const room = new RoomFormValues();
  const [loading, setLoading] = useState(false);

  const handleFinalFormSubmit = (values: any, form: FormApi) => {
    const { name, location } = values;

    let newRoom = {
      id: uuid(),
      name: name,
      locationId: location,
    };
    setLoading(true);
    createRoom(newRoom)
      .then(() => {
        form.change("name", undefined);
        form.resetFieldState("name");
      })
      .finally(() => setLoading(false));
  };

  return (
    <FinalForm
      onSubmit={handleFinalFormSubmit}
      validate={validate}
      initialValues={room}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form onSubmit={handleSubmit} loading={loading}>
          <Field
            placeholder="Select a Location"
            name="location"
            value={room.locationId}
            options={sortedLocationByName.map((Location: ILocation) => {
              return {
                key: Location.id,
                text: Location.name,
                value: Location.id,
              };
            })}
            component={SelectInput}
            inputOnChange={changeLocation}
          />
          <Field
            placeholder="Room Name"
            name="name"
            value={room.name}
            component={TextInput}
          />

          <Button
            floated="right"
            positive
            type="submit"
            content="Add Room"
            disabled={loading || invalid || pristine}
          />
        </Form>
      )}
    />
  );
};

export default observer(RoomForm);
