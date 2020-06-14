import React, { useContext, useEffect, Fragment, useState } from "react";
import { RootStoreContext } from "../../../stores/rootStore";
import { observer } from "mobx-react-lite";
import { getDaysInMonth } from "../../../helpers/shiftHelper";
import { Grid, Container } from "semantic-ui-react";

const ShiftMonthList = () => {
  const rootStore = useContext(RootStoreContext);
  const { shifts, loadShifts } = rootStore.shiftStore;
  const [daysInMonth, setDaysInMonth] = useState<number>(0);

  useEffect(() => {
    let numberOfDays = getDaysInMonth();
    setDaysInMonth(numberOfDays);
    console.log(numberOfDays);
    console.log(numberOfDays);
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
        {Array(daysInMonth).fill(
          <Grid.Column style={{ border: "1px solid black" }}>test</Grid.Column>
        )}
      </Grid>
    </Fragment>
  );
};

export default observer(ShiftMonthList);
