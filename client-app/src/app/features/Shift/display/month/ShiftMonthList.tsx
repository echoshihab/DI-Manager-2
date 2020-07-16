import React, { useContext, useEffect, useState } from "react";
import { RootStoreContext } from "../../../../stores/rootStore";
import { observer } from "mobx-react-lite";
import { getMonthDates } from "../../../../helpers/shiftHelper";
import { Grid, Segment, Header } from "semantic-ui-react";
import { IShift } from "../../../../models/shift";
import { format } from "date-fns";

const ShiftMonthList = () => {
  const rootStore = useContext(RootStoreContext);
  const { shiftsByMonth, predicate } = rootStore.shiftStore;
  const [daysInMonth, setDaysInMonth] = useState<{
    [key: string]: IShift[] | [];
  }>({});

  useEffect(() => {
    let monthDates = getMonthDates();
    setDaysInMonth(monthDates);
  }, [setDaysInMonth]);

  return (
    <Segment>
      <Header as="h2" attached="top" textAlign="center">
        {predicate.get("selectedDate") || format(new Date(), "MMMM YYYY")}
      </Header>
      <Grid columns={7} divided style={{ marginTop: "20px" }}>
        {Object.keys(daysInMonth).map((d) => (
          <Grid.Column key={d} style={{ border: "1px solid black" }}>
            {d}
            <ul>
              {shiftsByMonth[d]?.map((shift) => (
                <li key={shift.id}>{shift.locationName}</li>
              ))}
            </ul>
          </Grid.Column>
        ))}
      </Grid>
    </Segment>
  );
};

export default observer(ShiftMonthList);
