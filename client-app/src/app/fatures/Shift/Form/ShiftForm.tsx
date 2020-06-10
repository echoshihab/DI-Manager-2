import React, { useState, ChangeEvent } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IShift } from "../../../models/shift";
import { v4 as uuid } from "uuid";

interface IProps {
  createShift: (shift: IShift) => void;
  editShift: (shift: IShift) => void;
  editMode: Boolean;
  selectedShift: IShift;
}

const ShiftForm: React.FC<IProps> = ({
  createShift,
  editMode,
  editShift,
  selectedShift,
}) => {
  const initializeForm = () => {
    if (selectedShift) {
      return selectedShift;
    } else {
      return {
        id: "",
        start: "",
        end: "",
        license: "",
        location: "",
        room: "",
        technologist: "",
        modality: "",
      };
    }
  };

  const [shift, setShift] = useState<IShift>(initializeForm);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setShift({ ...shift, [name]: value });
  };

  const handleSubmit = () => {
    if (shift.id.length === 0) {
      let newShift = {
        ...shift,
        id: uuid(),
      };
      createShift(newShift);
    } else {
      editShift(shift);
    }
  };

  return (
    <Segment>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          type="datetime-local"
          placeholder="Start Time"
          value={shift.start}
          name="start"
          onChange={handleInputChange}
        />
        <Form.Input
          type="datetime-local"
          name="end"
          placeholder="End Time"
          value={shift.end}
          onChange={handleInputChange}
        />
        <Form.Input
          name="license"
          placeholder="License"
          value={shift.license}
          onChange={handleInputChange}
        />
        <Form.Input
          name="location"
          placeholder="Location"
          value={shift.location}
          onChange={handleInputChange}
        />
        <Form.Input
          name="room"
          placeholder="Room"
          value={shift.room}
          onChange={handleInputChange}
        />
        <Form.Input
          name="technologist"
          placeholder="Technologist"
          value={shift.technologist}
          onChange={handleInputChange}
        />
        <Form.Input
          name="modality"
          placeholder="Modality"
          value={shift.modality}
          onChange={handleInputChange}
        />
        <Button type="submit" content="Submit" />
      </Form>
    </Segment>
  );
};

export default ShiftForm;
