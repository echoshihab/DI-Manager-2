import React, { useContext, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import ShiftMonthList from "../display/month/ShiftMonthList";
import ShiftFilters from "./ShiftFilters";
import ShiftDayList from "../display/day/ShiftDayList";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../stores/rootStore";
import LoadingComponent from "../../../layout/LoadingComponent";

interface IProps {
  view: string;
}

const ShiftDashboard: React.FC<IProps> = ({ view }) => {
  const rootStore = useContext(RootStoreContext);
  const { loadLocations } = rootStore.locationStore;
  const { loadTechnologists } = rootStore.technologistStore;
  const { loadLicenses } = rootStore.licenseStore;
  const { setAppLoaded } = rootStore.commonStore;
  const [loading, setLoading] = useState(false);
  const { loadShifts } = rootStore.shiftStore;

  useEffect(() => {
    Promise.all([
      loadLocations(),
      loadTechnologists("288eb0dd-f9ef-4e67-b5c8-acf8b3366037"),
      loadShifts(),
      loadLicenses("288eb0dd-f9ef-4e67-b5c8-acf8b3366037"),
    ]).finally(() => setAppLoaded());
  }, [
    loadShifts,
    loadLocations,
    loadTechnologists,
    setAppLoaded,
    loadLicenses,
  ]);

  return (
    <Grid>
      {loading ? (
        <LoadingComponent content="Loading technologists..." />
      ) : (
        <Grid.Column width={12} floated="right">
          {view === "Month" && <ShiftMonthList />}
          {view === "Date" && <ShiftDayList />}
        </Grid.Column>
      )}
      <Grid.Column floated="left">
        <ShiftFilters view={view} setLoading={setLoading} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ShiftDashboard);
