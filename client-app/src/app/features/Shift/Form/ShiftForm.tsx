import React, { useState, ChangeEvent, SyntheticEvent } from "react";
import { Segment, Form, Button, ButtonProps } from "semantic-ui-react";
import { IShift, ShiftFormValues } from "../../../models/shift";
import { v4 as uuid } from "uuid";
import { Form as FinalForm, Field } from "react-final-form";
import { combineValidators, isRequired } from "revalidate";
import DateInput from "../../../common/form/DateInput";
import SelectInput from "../../../common/form/SelectInput";
import { FormApi } from "final-form";

const validate = combineValidators({
  date: isRequired("Date"),
  start: isRequired("start"),
  end: isRequired("end"),
});

const ShiftForm = () => {
  const [shift, setShift] = useState(new ShiftFormValues());

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setShift({ ...shift, [name]: value });
  };

  const handleClearForm = (
    e: SyntheticEvent,
    form: FormApi<any, Partial<any>>
  ) => {
    e.preventDefault();
    form.reset();
    form.getRegisteredFields().forEach((field) => form.resetFieldState(field));
  };

  const handleFinalFormSubmit = () => {
    if (shift.id?.length === 0) {
      let newShift = {
        ...shift,
        id: uuid(),
      };
      console.log(newShift);
    }
  };

  return (
    <Segment compact>
      <FinalForm
        validate={validate}
        initialValues={shift}
        onSubmit={handleFinalFormSubmit}
        render={({ form, handleSubmit, invalid, pristine, validating }) => (
          <Form onSubmit={handleSubmit} id={"shiftForm"}>
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
              placeholder="Exam Type"
              name="license"
              value={shift.licenseId}
              component={SelectInput}
            />
            <Field
              name="location"
              placeholder="location"
              value={shift.locationId}
              component={SelectInput}
            />
            <Field
              name="room"
              placeholder="Room"
              value={shift.roomId}
              component={SelectInput}
            />
            <Field
              name="technologist"
              placeholder="Technologist"
              value={shift.technologistId}
              component={SelectInput}
            />

            <Button type="submit" content="Add Shift" color="green" />
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

export default ShiftForm;
