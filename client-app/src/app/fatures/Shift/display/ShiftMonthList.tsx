import React, { useContext, useEffect, Fragment, useState } from "react";
import { RootStoreContext } from "../../../stores/rootStore";
import { observer } from "mobx-react-lite";
import { getMonthDates } from "../../../helpers/shiftHelper";
import { Grid } from "semantic-ui-react";
import { IShift } from "../../../models/shift";

const ShiftMonthList = () => {
  const rootStore = useContext(RootStoreContext);
  const { shiftsByDate } = rootStore.shiftStore;
  const [daysInMonth, setDaysInMonth] = useState<{
    [key: string]: IShift[] | [];
  }>({});

  useEffect(() => {
    let monthDates = getMonthDates();
    setDaysInMonth(monthDates);
  }, [setDaysInMonth]);

  return (
    <Fragment>
      <Grid columns={7} divided style={{ marginTop: "20px" }}>
        {Object.keys(daysInMonth).map((d) => (
          <Grid.Column key={d} style={{ border: "1px solid black" }}>
            {d}
            <ul>
              {shiftsByDate[d]?.map((s) => (
                <li key={s.id}>{s.location}</li>
              ))}
            </ul>
          </Grid.Column>
        ))}
      </Grid>
    </Fragment>
  );
};

export default observer(ShiftMonthList);
