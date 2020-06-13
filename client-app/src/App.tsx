import React, { Fragment } from "react";
import "./App.css";

import ShiftMonthList from "./app/fatures/Shift/display/ShiftMonthList";
import HomePage from "./app/fatures/home/HomePage";
import { Route } from "react-router-dom";
import ShiftDashboard from "./app/fatures/Shift/dashboard/ShiftDashboard";

const App = () => {
  // const [shifts, setShifts] = useState<IShift[]>([]);

  // const [editMode, setEditMode] = useState(false);

  // const [selectedShift, setSelectedShift] = useState<IShift | null>(null);

  // const handleCreateShift = (shift: IShift) => {
  //   setShifts([...shifts, shift]);
  //   agent.Shifts.create(shift);
  // };

  // const handleEditShift = (shift: IShift) => {
  //   setShifts([...shifts.filter((s) => s.id !== shift.id), shift]);
  //   agent.Shifts.edit(shift);
  // };

  // const handleDeleteShift = (id: string) => {
  //   setShifts([...shifts.filter((s) => s.id !== id)]);
  //   agent.Shifts.delete(id);
  // };

  // const handleSelectShift = (id: string) => {
  //   console.log(id);
  //   setEditMode(true);
  //   let shiftSelected = shifts.filter((s) => s.id === id)[0];
  //   setSelectedShift(shiftSelected);
  //   console.log(selectedShift);
  // };

  // useEffect(() => {
  //   agent.Shifts.list().then((response) => {
  //     let shifts: IShift[] = [];
  //     response.forEach((shift) => {
  //       shifts.push(shift);
  //     });
  //     setShifts(shifts);
  //   });
  // }, []);

  return (
    <Fragment>
      <Route exact path="/" component={HomePage} />
      <Route path="/monthview" component={ShiftDashboard} />
    </Fragment>
  );
};

export default App;
