import React, { useContext } from "react";
import { RootStoreContext } from "../../../stores/rootStore";
import { observer } from "mobx-react-lite";

const ShiftDayList = () => {
  const rootStore = useContext(RootStoreContext);

  return (
    <ul>
      {/* {shifts.map((shift) => (
        <li key={shift.id}>
          {shift.location}|{shift.room}|{shift.license}|{shift.start}:{" "}
          {shift.end}|{shift.technologist}
        </li>
      ))} */}
    </ul>
  );
};

export default observer(ShiftDayList);
