import React, { useContext } from "react";
import { RootStoreContext } from "../../../stores/rootStore";
import { observer } from "mobx-react-lite";
import { Table, Segment } from "semantic-ui-react";
import { format } from "date-fns";

const ShiftDayList = () => {
  const rootStore = useContext(RootStoreContext);
  const { shiftsByDay } = rootStore.shiftStore;

  return (
    <Segment.Group>
      <Segment>
        <Table celled style={{ marginLeft: "150px" }}>
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
                <Table.Cell>{shift.location}</Table.Cell>
                <Table.Cell>{shift.room}</Table.Cell>
                <Table.Cell>{shift.license}</Table.Cell>
                <Table.Cell>{format(shift.start, "HH:mm")}</Table.Cell>
                <Table.Cell>{format(shift.end, "HH:mm")}</Table.Cell>
                <Table.Cell>{shift.technologist}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    </Segment.Group>
  );
};

export default observer(ShiftDayList);
