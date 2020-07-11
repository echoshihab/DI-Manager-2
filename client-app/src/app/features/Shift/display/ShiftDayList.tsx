import React, { useContext, Fragment, useState, useEffect } from "react";
import { RootStoreContext } from "../../../stores/rootStore";
import { observer } from "mobx-react-lite";
import {
  Table,
  Accordion,
  Label,
  Icon,
  AccordionTitleProps,
} from "semantic-ui-react";
import { format } from "date-fns";
import ShiftForm from "../Form/ShiftForm";

const ShiftDayList = () => {
  const rootStore = useContext(RootStoreContext);
  const { shiftsByDay } = rootStore.shiftStore;
  const { loadLocations } = rootStore.locationStore;
  const { loadRooms } = rootStore.roomStore;
  const { loadTechnologists } = rootStore.technologistStore;
  const { setAppLoaded, appLoaded } = rootStore.commonStore;

  useEffect(() => {
    Promise.all([
      loadLocations(),
      loadTechnologists("288eb0dd-f9ef-4e67-b5c8-acf8b3366037"),
    ]).finally(() => setAppLoaded());
  }, [loadLocations, loadTechnologists, setAppLoaded]);

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

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell>Room</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Start</Table.HeaderCell>
            <Table.HeaderCell>End</Table.HeaderCell>
            <Table.HeaderCell>Technologist</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {shiftsByDay.map((shift) => (
            <Table.Row>
              <Table.Cell>{shift.locationName}</Table.Cell>
              <Table.Cell>{shift.roomName}</Table.Cell>
              <Table.Cell>{shift.licenseDisplayName}</Table.Cell>
              <Table.Cell>{format(shift.start, "HH:mm")}</Table.Cell>
              <Table.Cell>{format(shift.end, "HH:mm")}</Table.Cell>
              <Table.Cell>{shift.technologistInitial}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Fragment>
  );
};

export default observer(ShiftDayList);
