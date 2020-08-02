import React, { useContext, useState, SyntheticEvent } from "react";
import { Button, Icon, Form, Step, Label, Segment } from "semantic-ui-react";
import { format } from "date-fns";
import { IShift, ShiftFormValues } from "../../../../models/shift";
import { RootStoreContext } from "../../../../stores/rootStore";
import { observer } from "mobx-react-lite";
import { Field, Form as FinalForm } from "react-final-form";
import SelectInput from "../../../../common/form/SelectInput";
import DateInput from "../../../../common/form/DateInput";
import LoadingComponent from "../../../../layout/LoadingComponent";

interface IProps {
  shift: IShift;
}

const ShiftDayListItem: React.FC<IProps> = ({ shift }) => {
  const rootStore = useContext(RootStoreContext);
  const { deleteShift, editShift, submitting } = rootStore.shiftStore;
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

  const toggleEditMode = (event: SyntheticEvent) => {
    setLoading(true);
    if (event.currentTarget.id === "displayForm") {
      selectTechnologist(shift.technologistId);
      loadRooms(shift.locationId).finally(() => setLoading(false));
    } else {
      setRoomPlaceholder(false);
      setLicensePlaceHolder(false);
      setLoading(false);
    }

    setEditMode(!editMode);
  };

  const handleFinalFormSubmit = (values: any, form: any) => {
    const { end, start, ...shift } = values;

    let editedShift = shift as ShiftFormValues;
    editedShift.start = start;
    editedShift.end = end;
    editedShift.modalityId = "288eb0dd-f9ef-4e67-b5c8-acf8b3366037";
    editedShift.id = shift.id;
    console.log(editedShift);

    setLoading(true);
    editShift(editedShift)
      .then(() => form.restart())
      .finally(() => setLoading(false));
    setEditMode(false);
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

  const handleRoomChange = () => {
    setRoomPlaceholder(false);
  };

  const handleLicenseChange = () => {
    setLicensePlaceHolder(false);
  };

  const handleDeleteShift = (event: SyntheticEvent) => {
    setLoading(true);
    deleteShift(shift.id).finally(() => setLoading(false));
  };

  return editMode ? (
    <Segment raised>
      <FinalForm
        initialValues={shift}
        onSubmit={handleFinalFormSubmit}
        render={({ handleSubmit, invalid, pristine }) => (
          <Form onSubmit={handleSubmit} loading={loading}>
            <Form.Group>
              <Label size="medium">Location: </Label>

              <Field
                name="locationId"
                component={SelectInput}
                defaultValue={shift.locationId}
                inputOnChange={handleLocationChange}
                options={sortedLocationByName.map((location) => {
                  return {
                    key: location.id,
                    text: location.name,
                    value: location.id,
                  };
                })}
              />
              <Label size="medium">Room: </Label>
              <Field
                name="roomId"
                inputOnChange={handleRoomChange}
                component={SelectInput}
                defaultValue={shift.roomId}
                text={roomPlaceholder ? "Select a room" : undefined} //add placeholder on location change
                options={sortedRoomsByName.map((room) => {
                  return {
                    key: room.id,
                    text: room.name,
                    value: room.id,
                  };
                })}
              />
              <Label size="medium">Technologist: </Label>
              <Field
                name="technologistId"
                component={SelectInput}
                defaultValue={shift.technologistId}
                inputOnChange={handleTechnologistChange}
                options={sortedTechnologistByInitial.map((technologist) => {
                  return {
                    key: technologist.id,
                    text: technologist.initial,
                    value: technologist.id,
                  };
                })}
              />
              <Label size="medium">License: </Label>
              <Field
                name="licenseId"
                component={SelectInput}
                defaultValue={shift.licenseId}
                inputOnChange={handleLicenseChange}
                text={licensePlaceholder ? "Select License" : undefined}
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
              <Label size="medium">Start: </Label>
              <Field
                component={DateInput}
                placeholder="Start Time"
                time={true}
                name="start"
                defaultValue={shift.start}
                label="start"
              />
              <Label size="medium">End: </Label>
              <Field
                component={DateInput}
                placeholder="End Time"
                time={true}
                name="end"
                defaultValue={shift.end}
              />
              <Button
                loading={submitting}
                type="submit"
                disabled={loading || invalid || pristine}
              >
                <Icon name="check" color="green" />
              </Button>

              <Button onClick={toggleEditMode} id="cancelForm">
                <Icon name="cancel" color="red" />
              </Button>
            </Form.Group>
          </Form>
        )}
      />
    </Segment>
  ) : loading ? (
    <LoadingComponent content="Loading Shifts..." />
  ) : (
    <Step.Group fluid>
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
        <Button
          circular
          size="mini"
          onClick={toggleEditMode}
          outline="black"
          id="displayForm"
        >
          <Icon name="edit" color="blue" />
        </Button>
        <Button circular size="mini" id="delete" onClick={handleDeleteShift}>
          <Icon name="trash alternate outline" color="red" />
        </Button>
      </Step>
    </Step.Group>
  );
};
export default observer(ShiftDayListItem);
