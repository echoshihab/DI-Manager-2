import React, { useContext, useEffect, Fragment, useState } from "react";
import { RootStoreContext } from "../../../stores/rootStore";
import { observer } from "mobx-react-lite";
import { getMonthDates } from "../../../helpers/shiftHelper";
import { Grid } from "semantic-ui-react";

const ShiftMonthList = () => {
  const rootStore = useContext(RootStoreContext);
  const { shifts, loadShifts } = rootStore.shiftStore;
  const [daysInMonth, setDaysInMonth] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    let monthDates = getMonthDates();
    setDaysInMonth(monthDates);
    loadShifts();
  }, [setDaysInMonth, loadShifts]);

  return (
    <Fragment>
      {/* <ul>
        {shifts.map((shift) => (
          <li key={shift.id}>
            {shift.location}|{shift.room}|{shift.license}|{shift.start}:{" "}
            {shift.end}|{shift.technologist}
          </li>
        ))}
      </ul> */}

      <Grid columns={7} divided style={{ marginTop: "20px" }}>
        {Object.keys(daysInMonth).map((d) => (
          <Grid.Column key={d} style={{ border: "1px solid black" }}>
            {d}
          </Grid.Column>
        ))}
      </Grid>
    </Fragment>
  );
};

export default observer(ShiftMonthList);
