import React, { useEffect, useState, Fragment } from "react";
import "./App.css";
import agent from "./app/api/agent";
import { IShift } from "./app/models/shift";
import ShiftDayList from "./app/fatures/Shift/display/ShiftDayList";
import ShiftForm from "./app/fatures/Shift/Form/ShiftForm";

const App = () => {
  const [shifts, setShifts] = useState<IShift[]>([]);

  const [editMode, setEditMode] = useState(false);

  const [selectedShift, setSelectedShift] = useState<IShift | null>(null);

  const handleCreateShift = (shift: IShift) => {
    setShifts([...shifts, shift]);
    agent.Shifts.create(shift);
  };

  const handleEditShift = (shift: IShift) => {
    setShifts([...shifts.filter((s) => s.id !== shift.id), shift]);
    agent.Shifts.edit(shift);
  };

  const handleDeleteShift = (id: string) => {
    setShifts([...shifts.filter((s) => s.id !== id)]);
    agent.Shifts.delete(id);
  };

  const handleSelectShift = (id: string) => {
    console.log(id);
    setEditMode(true);
    let shiftSelected = shifts.filter((s) => s.id === id)[0];
    setSelectedShift(shiftSelected);
    console.log(selectedShift);
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
      <ShiftDayList
        shifts={shifts}
        selectShift={handleSelectShift}
        deleteShift={handleDeleteShift}
      />
      {selectedShift && (
        <ShiftForm
          createShift={handleCreateShift}
          editShift={handleEditShift}
          editMode={editMode}
          selectedShift={selectedShift!}
        />
      )}
    </Fragment>
  );
};

export default App;
