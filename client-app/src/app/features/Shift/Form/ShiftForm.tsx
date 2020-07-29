import React, { useState, SyntheticEvent, useContext, useEffect } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { ShiftFormValues } from "../../../models/shift";
import { v4 as uuid } from "uuid";
import { Form as FinalForm, Field } from "react-final-form";
import { combineValidators, isRequired } from "revalidate";
import DateInput from "../../../common/form/DateInput";
import SelectInput from "../../../common/form/SelectInput";
import { FormApi } from "final-form";
import { combineDateAndTime, filterDate } from "../../../helpers/util";
import { RootStoreContext } from "../../../stores/rootStore";
import { observer } from "mobx-react-lite";

const validate = combineValidators({
  date: isRequired("Date"),
  start: isRequired("start"),
  end: isRequired("end"),
});

const ShiftForm = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    sortedTechnologistByInitial,
    selectTechnologist,
    technologist,
  } = rootStore.technologistStore;
  const { loadRooms, sortedRoomsByName } = rootStore.roomStore;
  const { sortedLocationByName } = rootStore.locationStore;
  const { user } = rootStore.userStore;
  const { createShift, predicate } = rootStore.shiftStore;
  const [shift, setShift] = useState(new ShiftFormValues());
  const [rooms, setRooms] = useState(false);
  const [licenses, setLicenses] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClearForm = (
    e: SyntheticEvent,
    form: FormApi<any, Partial<any>>
  ) => {
    e.preventDefault();
    setRooms(false);
    setLicenses(false);
    form.reset();
    form.getRegisteredFields().forEach((field) => form.resetFieldState(field));
  };

  const handleLocationChange = (id: string) => {
    loadRooms(id);
    setRooms(true);
  };

  const handleTechnologistChange = (id: string) => {
    selectTechnologist(id);
    setLicenses(true);
  };

  const handleFinalFormSubmit = (values: any, form: any) => {
    const { date, end, start, ...shift } = values;

    const shiftStart = combineDateAndTime(date, start);
    const shiftEnd = combineDateAndTime(date, end);

    let newShift = shift as ShiftFormValues;
    newShift.start = shiftStart;
    newShift.end = shiftEnd;
    newShift.modalityId = user?.modalityId as string;
    newShift.id = uuid();

    setLoading(true);
    createShift(newShift)
      .then(() => form.restart())
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (predicate.has(filterDate)) {
      let date = predicate.get(filterDate) as Date;
      let updatedShift = new ShiftFormValues();
      updatedShift.date = date;
      setShift(updatedShift);
    }
  }, [predicate]);

  return (
    <Segment compact>
      <FinalForm
        validate={validate}
        initialValues={shift}
        onSubmit={handleFinalFormSubmit}
        render={({ form, handleSubmit, invalid, pristine }) => (
          <Form onSubmit={handleSubmit} loading={loading}>
            <Field
              component={DateInput}
              placeholder="Date"
              date={true}
              name="date"
              value={shift.date}
            />
            <Field
              component={DateInput}
              placeholder="Start Time"
              time={true}
              name="start"
              value={shift.start}
            />
            <Field
              component={DateInput}
              placeholder="End Time"
              time={true}
              name="end"
              value={shift.end}
            />
            <Field
              name="locationId"
              placeholder="Location"
              value={shift.locationId}
              component={SelectInput}
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
              placeholder="Room"
              disabled={!rooms}
              value={shift.roomId}
              component={SelectInput}
              options={sortedRoomsByName.map((room) => {
                return {
                  key: room.id,
                  value: room.id,
                  text: room.name,
                };
              })}
            />

            <Field
              name="technologistId"
              placeholder="Technologist"
              value={shift.technologistId}
              component={SelectInput}
              inputOnChange={handleTechnologistChange}
              options={sortedTechnologistByInitial.map((technologist) => {
                return {
                  key: technologist.id,
                  value: technologist.id,
                  text: `${technologist.name} (${technologist.initial})`,
                };
              })}
            />

            <Field
              placeholder="License"
              name="licenseId"
              value={shift.licenseId}
              component={SelectInput}
              disabled={!licenses}
              options={
                technologist
                  ? technologist.licenses.map((license) => {
                      return {
                        key: license.licenseId,
                        value: license.licenseId,
                        text: license.licenseDisplayName,
                      };
                    })
                  : [{ value: "", text: "" }]
              }
            />

            <Button
              type="submit"
              content="Add Shift"
              color="green"
              disabled={loading || invalid || pristine}
            />
            <Button
              onClick={(e) => handleClearForm(e, form)}
              content="Clear"
              color="blue"
            />
          </Form>
        )}
      />
    </Segment>
  );
};

export default observer(ShiftForm);
