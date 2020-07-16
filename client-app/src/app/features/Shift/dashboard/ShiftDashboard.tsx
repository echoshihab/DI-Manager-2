import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ShiftMonthList from "../display/month/ShiftMonthList";
import ShiftFilters from "./ShiftFilters";
import ShiftDayList from "../display/day/ShiftDayList";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../stores/rootStore";

interface IProps {
  view: string;
}

const ShiftDashboard: React.FC<IProps> = ({ view }) => {
  const rootStore = useContext(RootStoreContext);
  const { loadLocations } = rootStore.locationStore;
  const { loadTechnologists } = rootStore.technologistStore;
  const { setAppLoaded } = rootStore.commonStore;
  const { loadShifts } = rootStore.shiftStore;

  useEffect(() => {
    Promise.all([
      loadLocations(),
      loadTechnologists("288eb0dd-f9ef-4e67-b5c8-acf8b3366037"),
      loadShifts(),
    ]).finally(() => setAppLoaded());
  }, [loadShifts, loadLocations, loadTechnologists, setAppLoaded]);

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
