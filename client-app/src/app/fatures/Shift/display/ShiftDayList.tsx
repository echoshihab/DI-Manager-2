import React from "react";
import { IShift } from "../../../models/shift";

interface IProps {
  shifts: IShift[];
}

const ShiftDayList: React.FC<IProps> = ({ shifts }) => {
  return (
    <ul>
      {shifts.map((shift) => (
        <li key={shift.id}>
          {shift.location}|{shift.room}|{shift.license}|{shift.start}:{" "}
          {shift.end}|{shift.technologist}
        </li>
      ))}
    </ul>
  );
};

export default ShiftDayList;
