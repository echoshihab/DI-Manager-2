import React, { useContext, Fragment, useState } from "react";
import { RootStoreContext } from "../../../../stores/rootStore";
import { observer } from "mobx-react-lite";
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
import { filterDate } from "../../../../helpers/util";

const ShiftDayList = () => {
  const rootStore = useContext(RootStoreContext);
  const { shiftsByDay, predicate } = rootStore.shiftStore;

  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (titleProps: AccordionTitleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? 1 : 0;
    setActiveIndex(newIndex);
  };

  return (
    <Fragment>
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
