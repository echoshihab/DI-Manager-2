import React, { useContext, Fragment, useState, useEffect } from "react";
import { RootStoreContext } from "../../../../stores/rootStore";
import { observer } from "mobx-react-lite";
import { useLocation } from "react-router-dom";
import {
  Accordion,
  Label,
  Icon,
  AccordionTitleProps,
  Segment,
  Header,
} from "semantic-ui-react";

import ShiftForm from "../../Form/ShiftForm";
import ShiftDayListItem from "./ShiftDayListItem";
import { filterDate, monthFlag, coordinator } from "../../../../helpers/util";

const ShiftDayList = () => {
  let location = useLocation();
  const rootStore = useContext(RootStoreContext);
  const {
    shiftsByDay,
    predicate,
    clearPredicate,
    setPredicate,
  } = rootStore.shiftStore;
  const { role } = rootStore.commonStore;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (titleProps: AccordionTitleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? 1 : 0;
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    if (predicate.has(monthFlag)) {
      clearPredicate();
    }
    if (location.state) {
      //monthview edit passing date to dayview
      let selectedDate = new Date(location.state as string);
      setPredicate(filterDate, selectedDate);
    }
  }, [predicate, clearPredicate, setPredicate, location.state]);

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
              {activeIndex === 0 ? "Add New Shift" : "Close Form"}
            </Label>
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <ShiftForm />
          </Accordion.Content>
        </Accordion>
      )}

      <Segment>
        <Header as="h2" attached="top" textAlign="center">
          {predicate.has(filterDate)
            ? (predicate.get(filterDate) as Date).toDateString()
            : new Date().toDateString()}
        </Header>
        {shiftsByDay.map((shift) => (
          <ShiftDayListItem key={shift.id} shift={shift} />
        ))}
      </Segment>
    </Fragment>
  );
};

export default observer(ShiftDayList);
