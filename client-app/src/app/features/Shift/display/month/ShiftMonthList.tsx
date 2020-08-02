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
  Accordion,
  Icon,
  AccordionTitleProps,
} from "semantic-ui-react";
import { IShift } from "../../../../models/shift";
import { format } from "date-fns";
import { filterDate, monthFlag, coordinator } from "../../../../helpers/util";
import { Link } from "react-router-dom";
import ShiftRangeForm from "../../Form/ShiftRangeForm";

const ShiftMonthList = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    shiftsByMonth,
    predicate,
    setPredicate,
    loading,
  } = rootStore.shiftStore;
  const { role } = rootStore.commonStore;
  const [daysInMonth, setDaysInMonth] = useState<{
    [key: string]: IShift[] | [];
  }>({});

  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (titleProps: AccordionTitleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? 1 : 0;
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    setPredicate(monthFlag, true);
    let monthDates = getMonthDates();
    setDaysInMonth(monthDates);
  }, [setDaysInMonth, setPredicate]);

  return (
    <Fragment>
      {role === coordinator && (
        <Accordion>
          <Accordion.Title
            active={activeIndex === 1}
            index={0}
            onClick={(e, titleProps) => handleClick(titleProps)}
          >
            <Icon name="dropdown" />
            <Label color="blue">
              {activeIndex === 0 ? "Add Shifts" : "Close Form"}
            </Label>
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <ShiftRangeForm />
          </Accordion.Content>
        </Accordion>
      )}
      <Segment>
        <Header as="h2" attached="top" textAlign="center">
          {predicate.has(filterDate)
            ? format(predicate.get(filterDate) as Date, "MMMM YYYY")
            : format(new Date().toDateString(), "MMMM YYYY")}
        </Header>
        <Container>
          {!loading && (
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

                  {shiftsByMonth[d]
                    ?.sort(
                      (a, b) =>
                        a.roomName.localeCompare(b.roomName) ||
                        a.start.getTime() - b.start.getTime()
                    )
                    .map((shift) => (
                      <Fragment key={shift.id}>
                        <Label color="blue">
                          {shift.roomName + " " + shift.licenseDisplayName}
                          <Label.Detail>
                            {format(shift.start, "hh:mm a")}-
                          </Label.Detail>
                          <Label.Detail>
                            {format(shift.end, "hh:mm a")}
                          </Label.Detail>
                          <Label.Detail>
                            {shift.technologistInitial}
                          </Label.Detail>
                        </Label>
                        <Divider fitted />
                      </Fragment>
                    ))}
                </Grid.Column>
              ))}
            </Grid>
          )}
        </Container>
      </Segment>
    </Fragment>
  );
};

export default observer(ShiftMonthList);
