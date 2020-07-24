import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label, Select } from "semantic-ui-react";

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {
  inputOnChange: (
    value: string | number | boolean | (string | number | boolean)[] | undefined
  ) => void;
  defaultValue: string[];
}

const SelectInput: React.FC<IProps> = ({
  input,
  width,
  options,
  inputOnChange,
  defaultValue,
  disabled,
  meta: { touched, error },
  text,
  placeholder,
}) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <Select
        disabled={disabled}
        value={input.value}
        onChange={(e, data) => {
          input.onChange(data.value);
          inputOnChange && inputOnChange(data.value);
        }}
        text={text}
        options={options}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default SelectInput;
