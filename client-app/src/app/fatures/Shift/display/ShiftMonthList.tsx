import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "../../../stores/rootStore";
import { observer } from "mobx-react-lite";

const ShiftMonthList = () => {
  const rootStore = useContext(RootStoreContext);
  const { shifts, loadShifts } = rootStore.shiftStore;

  useEffect(() => {
    loadShifts();
  }, [loadShifts]);

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

export default observer(ShiftMonthList);
