import React, { useContext, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import ShiftMonthList from "../display/ShiftMonthList";
import ShiftFilters from "./ShiftFilters";
import ShiftDayList from "../display/ShiftDayList";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../stores/rootStore";

interface IProps {
  view: string;
}

const ShiftDashboard: React.FC<IProps> = ({ view }) => {
  const rootStore = useContext(RootStoreContext);
  const { loadShifts } = rootStore.shiftStore;

  useEffect(() => {
    loadShifts();
  }, [loadShifts]);
  return (
    <Grid>
      <Grid.Column width={12} floated="right">
        {view === "Month" && <ShiftMonthList />}
        {view === "Date" && <ShiftDayList />}
      </Grid.Column>
      <Grid.Column floated="left">
        <ShiftFilters view={view} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ShiftDashboard);
