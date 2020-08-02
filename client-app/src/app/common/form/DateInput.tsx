import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label } from "semantic-ui-react";
import { DateTimePicker } from "react-widgets";

interface IProps extends FieldRenderProps<Date, HTMLElement>, FormFieldProps {}

const DateInput: React.FC<IProps> = ({
  input,
  width,
  type,
  date = false,
  time = false,
  id,
  timeFormat,
  meta: { touched, error },
  ...rest
}) => {
  time ? (timeFormat = "hh:mm a") : (timeFormat = undefined);

  return (
    <Form.Field error={touched && !!error} type={type} width={width}>
      <DateTimePicker
        value={input.value || null}
        onChange={input.onChange}
        onBlur={input.onBlur}
        onKeyDown={(e) => e.preventDefault()}
        date={date}
        time={time}
        format={timeFormat}
        timeFormat={timeFormat}
        {...rest}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default DateInput;
