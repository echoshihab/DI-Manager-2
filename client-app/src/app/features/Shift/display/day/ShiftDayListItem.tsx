import React, { useContext, useState } from "react";
import { Button, Icon, Form, Step, Label } from "semantic-ui-react";
import { format } from "date-fns";
import { IShift } from "../../../../models/shift";
import { RootStoreContext } from "../../../../stores/rootStore";
import { observer } from "mobx-react-lite";
import { Field, Form as FinalForm } from "react-final-form";
import SelectInput from "../../../../common/form/SelectInput";
import DateInput from "../../../../common/form/DateInput";
import LoadingComponent from "../../../../layout/LoadingComponent";
import { roomPlaceholder, licensePlaceholder } from "../../../../helpers/util";

interface IProps {
  shift: IShift;
}

const ShiftDayListItem: React.FC<IProps> = ({ shift }) => {
  const rootStore = useContext(RootStoreContext);
  const { deleteShift, submitting } = rootStore.shiftStore;
  const { sortedLocationByName } = rootStore.locationStore;
  const { loadRooms, sortedRoomsByName } = rootStore.roomStore;
  const {
    selectTechnologist,
    technologist,
    sortedTechnologistByInitial,
  } = rootStore.technologistStore;

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomPlaceholder, setRoomPlaceholder] = useState(false);
  const [licensePlaceholder, setLicensePlaceHolder] = useState(false);

  const toggleEditMode = () => {
    setLoading(true);
    selectTechnologist(shift.technologistId);
    loadRooms(shift.locationId).finally(() => setLoading(false));
    setEditMode(!editMode);
  };

  const handleFinalFormSubmit = (values: any) => {
    console.log(values);
  };

  const handleLocationChange = (id: string) => {
    setLoading(true);
    setRoomPlaceholder(true);
    loadRooms(id).finally(() => setLoading(false));
  };

  const handleTechnologistChange = (id: string) => {
    setLoading(true);
    setLicensePlaceHolder(true);
    selectTechnologist(id);
    setLoading(false);
  };

  return editMode ? (
    <FinalForm
      initialValues={shift}
      onSubmit={handleFinalFormSubmit}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form onSubmit={handleSubmit} loading={loading}>
          <Form.Group>
            <Field
              name="locationId"
              component={SelectInput}
              defaultValue={shift.locationId}
              label="Location"
              inputOnChange={handleLocationChange}
              options={sortedLocationByName.map((location) => {
                return {
                  key: location.id,
                  text: location.name,
                  value: location.id,
                };
              })}
            />

            <Field
              name="roomId"
              component={SelectInput}
              defaultValue={shift.roomId}
              label="Room"
              text={roomPlaceholder && "Select a room"} //add placeholder on location change
              options={sortedRoomsByName.map((room) => {
                return {
                  key: room.id,
                  text: room.name,
                  value: room.id,
                };
              })}
            />
            <Field
              name="technologistId"
              component={SelectInput}
              defaultValue={shift.technologistId}
              label="Technologist"
              inputOnChange={handleTechnologistChange}
              options={sortedTechnologistByInitial.map((technologist) => {
                return {
                  key: technologist.id,
                  text: technologist.initial,
                  value: technologist.id,
                };
              })}
            />
            <Field
              name="licenseId"
              component={SelectInput}
              defaultValue={shift.licenseId}
              text={licensePlaceholder && "Select License"}
              label="License"
              options={
                technologist
                  ? technologist.licenses.map((license) => {
                      return {
                        key: license.licenseId,
                        text: license.licenseDisplayName,
                        value: license.licenseId,
                      };
                    })
                  : undefined
              }
            />
          </Form.Group>
          <Form.Group>
            <Field
              component={DateInput}
              placeholder="Start Time"
              time={true}
              name="start"
              defaultValue={shift.start}
            />

            <Field
              component={DateInput}
              placeholder="End Time"
              time={true}
              name="end"
              defaultValue={shift.end}
            />
          </Form.Group>

          <Form.Group>
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
    <Step.Group>
      <Step>
        <Step.Content>
          <Step.Title>{shift.locationName}</Step.Title>
          <Step.Description>Location</Step.Description>
        </Step.Content>
      </Step>
      <Step>
        <Step.Content>
          <Step.Title>{shift.roomName}</Step.Title>
          <Step.Description>Room</Step.Description>
        </Step.Content>
      </Step>
      <Step>
        <Step.Content>
          <Step.Title>{shift.technologistInitial}</Step.Title>
          <Step.Description>Technologist</Step.Description>
        </Step.Content>
      </Step>

      <Step>
        <Step.Content>
          <Step.Title>{shift.licenseDisplayName}</Step.Title>
          <Step.Description>License</Step.Description>
        </Step.Content>
      </Step>
      <Step>
        <Step.Content>
          <Step.Title>{format(shift.start, "hh:mm a")}</Step.Title>
          <Step.Description>Start</Step.Description>
        </Step.Content>
      </Step>
      <Step>
        <Step.Content>
          <Step.Title>{format(shift.end, "hh:mm a")}</Step.Title>
          <Step.Description>End</Step.Description>
        </Step.Content>
      </Step>
      <Step>
        <Button circular size="mini" onClick={toggleEditMode} outline="black">
          <Icon name="edit" color="blue" />
        </Button>
        <Button circular size="mini" onClick={() => deleteShift(shift.id)}>
          <Icon name="trash alternate outline" color="red" />
        </Button>
      </Step>
    </Step.Group>
  );
};

export default observer(ShiftDayListItem);
