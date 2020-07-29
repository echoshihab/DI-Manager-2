import React, { useContext, useEffect, useState, Fragment } from "react";
import { RootStoreContext } from "../../../../stores/rootStore";
import { observer } from "mobx-react-lite";
import { getMonthDates } from "../../../../helpers/shiftHelper";
import {
  Grid,
  Segment,
  Header,
  Container,
  Label,
  Divider,
} from "semantic-ui-react";
import { IShift } from "../../../../models/shift";
import { format } from "date-fns";
import { filterDate, monthFlag, coordinator } from "../../../../helpers/util";
import { Link } from "react-router-dom";

const ShiftMonthList = () => {
  const rootStore = useContext(RootStoreContext);
  const { shiftsByMonth, predicate, setPredicate } = rootStore.shiftStore;
  const { role } = rootStore.commonStore;
  const [daysInMonth, setDaysInMonth] = useState<{
    [key: string]: IShift[] | [];
  }>({});

  useEffect(() => {
    setPredicate(monthFlag, true);
    let monthDates = getMonthDates();
    setDaysInMonth(monthDates);
  }, [setDaysInMonth, setPredicate]);

  return (
    <Segment>
      <Header as="h2" attached="top" textAlign="center">
        {predicate.has(filterDate)
          ? format(predicate.get(filterDate) as Date, "MMMM YYYY")
          : format(new Date().toDateString(), "MMMM YYYY")}
      </Header>
      <Container>
        <Grid columns={7} divided style={{ marginTop: "20px" }}>
          {Object.keys(daysInMonth).map((d) => (
            <Grid.Column key={d} style={{ border: "1px solid black" }}>
              {d.slice(3, 5)}
              {role === coordinator && (
                <Label
                  size="small"
                  attached="top right"
                  as={Link}
                  to={{
                    pathname: "/dayview",
                    state: d,
                  }}
                  basic
                  icon="edit"
                ></Label>
              )}

              {shiftsByMonth[d]?.map((shift) => (
                <Fragment key={shift.id}>
                  <Label color="blue">
                    {shift.roomName}
                    <Label.Detail>
                      {format(shift.start, "hh:mm a")}-
                    </Label.Detail>
                    <Label.Detail>{format(shift.end, "hh:mm a")}</Label.Detail>
                    <Label.Detail>{shift.technologistInitial}</Label.Detail>
                  </Label>
                  <Divider fitted />
                </Fragment>
              ))}
            </Grid.Column>
          ))}
        </Grid>
      </Container>
    </Segment>
  );
};

export default observer(ShiftMonthList);
