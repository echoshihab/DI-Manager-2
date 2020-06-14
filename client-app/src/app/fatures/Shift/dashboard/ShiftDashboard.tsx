import React from "react";
import { Grid, Container } from "semantic-ui-react";
import ShiftMonthList from "../display/ShiftMonthList";
import ShiftFilters from "./ShiftFilters";

const ShiftDashboard = () => {
  return (
    <Grid>
      <Grid.Column width={2} />
      <Grid.Column width={10}>
        <ShiftMonthList />
      </Grid.Column>
      <Grid.Column width={4}>
        <ShiftFilters />
      </Grid.Column>
    </Grid>
  );
};

export default ShiftDashboard;
