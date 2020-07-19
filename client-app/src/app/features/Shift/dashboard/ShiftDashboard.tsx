import React, { useContext, useEffect, useState, Fragment } from "react";
import { Grid } from "semantic-ui-react";
import ShiftMonthList from "../display/month/ShiftMonthList";
import ShiftFilters from "./ShiftFilters";
import ShiftDayList from "../display/day/ShiftDayList";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../stores/rootStore";
import LoadingComponent from "../../../layout/LoadingComponent";
import { filterDate } from "../../../helpers/util";

interface IProps {
  view: string;
}

const ShiftDashboard: React.FC<IProps> = ({ view }) => {
  const rootStore = useContext(RootStoreContext);
  const { loadLocations } = rootStore.locationStore;
  const { loadTechnologists } = rootStore.technologistStore;
  const { loadLicenses } = rootStore.licenseStore;
  const [loading, setLoading] = useState(false);
  const {
    loadShifts,
    predicate,
    setPredicate,
    clearShifts,
  } = rootStore.shiftStore;

  useEffect(() => {
    if (!predicate.has(filterDate)) {
      setPredicate(filterDate, new Date());
    }
    setLoading(true);
    Promise.all([
      loadLocations(),
      loadTechnologists("288eb0dd-f9ef-4e67-b5c8-acf8b3366037"),
      loadShifts(),
      loadLicenses("288eb0dd-f9ef-4e67-b5c8-acf8b3366037"),
    ]).finally(() => setLoading(false));
    return () => clearShifts();
  }, [
    loadShifts,
    loadLocations,
    loadTechnologists,
    loadLicenses,
    predicate,
    setPredicate,
    clearShifts,
  ]);

  return (
    <Grid>
      <Grid.Column width={12} floated="right">
        {loading ? (
          <LoadingComponent content="Loading shifts..." inverted />
        ) : (
          <Fragment>
            {view === "Month" && <ShiftMonthList />}
            {view === "Date" && <ShiftDayList />}
          </Fragment>
        )}
      </Grid.Column>

      <Grid.Column floated="left">
        <ShiftFilters view={view} setLoading={setLoading} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ShiftDashboard);
