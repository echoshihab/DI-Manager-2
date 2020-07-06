import React from "react";
import { Grid } from "semantic-ui-react";
import ShiftMonthList from "../display/ShiftMonthList";
import ShiftFilters from "./ShiftFilters";
import ShiftDayList from "../display/ShiftDayList";

interface IProps {
  view: string;
}

const ShiftDashboard: React.FC<IProps> = ({ view }) => {
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

export default ShiftDashboard;
