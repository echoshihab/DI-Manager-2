import React, { useEffect, useState } from "react";

import "./App.css";
import agent from "./app/api/agent";
import { IShift } from "./app/models/shift";

const App = () => {
  const [shifts, setShifts] = useState<IShift[]>([]);

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

export default App;
