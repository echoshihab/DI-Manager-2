import React from "react";
import { IShift } from "../../../models/shift";
import { Button } from "semantic-ui-react";

interface IProps {
  shifts: IShift[];
  selectShift: (id: string) => void;
}

const ShiftDayList: React.FC<IProps> = ({ shifts, selectShift }) => {
  return (
    <ul>
      {shifts.map((shift) => (
        <li key={shift.id}>
          {shift.location}|{shift.room}|{shift.license}|{shift.start}:{" "}
          {shift.end}|{shift.technologist}
          <Button onClick={() => selectShift(shift.id)} content="Edit" />
        </li>
      ))}
    </ul>
  );
};

export default ShiftDayList;
