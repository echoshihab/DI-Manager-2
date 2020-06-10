import React, { useEffect, useState, Fragment } from "react";

import "./App.css";
import agent from "./app/api/agent";
import { IShift } from "./app/models/shift";
import ShiftDayList from "./app/fatures/Shift/display/ShiftDayList";
import ShiftForm from "./app/fatures/Shift/Form/ShiftForm";

const App = () => {
  const [shifts, setShifts] = useState<IShift[]>([]);

  const handleCreateShift = (shift: IShift) => {
    setShifts([...shifts, shift]);
    agent.Shifts.create(shift);
  };

  useEffect(() => {
    agent.Shifts.list().then((response) => {
      let shifts: IShift[] = [];
      response.forEach((shift) => {
        shifts.push(shift);
      });
      setShifts(shifts);
    });
  }, []);

  return (
    <Fragment>
      <ShiftDayList shifts={shifts} />
      <ShiftForm createShift={handleCreateShift} />
    </Fragment>
  );
};

export default App;
