import React from "react";
import { Grid } from "semantic-ui-react";
import ShiftMonthList from "../display/ShiftMonthList";
import ShiftFilters from "./ShiftFilters";

const ShiftDashboard = () => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ShiftMonthList />
      </Grid.Column>
      <Grid.Column width={6}>
        <ShiftFilters />
      </Grid.Column>
    </Grid>
  );
};

export default ShiftDashboard;
