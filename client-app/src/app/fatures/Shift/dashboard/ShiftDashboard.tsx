import React from "react";
import { Grid } from "semantic-ui-react";
import ShiftMonthList from "../display/ShiftMonthList";
import ShiftFilters from "./ShiftFilters";

const ShiftDashboard = () => {
  return (
    <Grid>
      <Grid.Column width={12} floated="right">
        <ShiftMonthList />
      </Grid.Column>
      <Grid.Column floated="left">
        <ShiftFilters />
      </Grid.Column>
    </Grid>
  );
};

export default ShiftDashboard;
