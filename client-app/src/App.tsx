import React, { Fragment, useContext, useEffect } from "react";
import "./App.css";

import { RootStoreContext } from "./app/stores/rootStore";
import HomePage from "./app/fatures/home/HomePage";
import { Route } from "react-router-dom";
import ShiftDashboard from "./app/fatures/Shift/dashboard/ShiftDashboard";
import NavBar from "./app/layout/NavBar";
import { observer } from "mobx-react-lite";

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
  const rootStore = useContext(RootStoreContext);
  const { loadShifts } = rootStore.shiftStore;

  useEffect(() => {
    loadShifts();
  }, [loadShifts]);

  return (
    <Fragment>
      <NavBar />
      <Route exact path="/" component={HomePage} />
      <Route path="/monthview" component={ShiftDashboard} />
    </Fragment>
  );
};

export default observer(App);
