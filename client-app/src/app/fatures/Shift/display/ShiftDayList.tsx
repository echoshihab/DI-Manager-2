import React from "react";
import { IShift } from "../../../models/shift";
import { Button } from "semantic-ui-react";

interface IProps {
  shifts: IShift[];
  selectShift: (id: string) => void;
  deleteShift: (id: string) => void;
}

const ShiftDayList: React.FC<IProps> = ({
  shifts,
  selectShift,
  deleteShift,
}) => {
  return (
    <ul>
      {shifts.map((shift) => (
        <li key={shift.id}>
          {shift.location}|{shift.room}|{shift.license}|{shift.start}:{" "}
          {shift.end}|{shift.technologist}
          <Button onClick={() => selectShift(shift.id)} content="Edit" />
          <Button onClick={() => deleteShift(shift.id)} content="Delete" />
        </li>
      ))}
    </ul>
  );
};

export default ShiftDayList;
