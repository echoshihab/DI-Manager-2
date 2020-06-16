import React from "react";
import { IShift } from "../../../../models/shift";
import { Segment, List } from "semantic-ui-react";
import { format } from "date-fns";

interface IProps {
  shift: IShift;
}

const ShiftDayListItem: React.FC<IProps> = ({ shift }) => {
  return (
    <Segment.Group>
      <Segment>
        <List divided horizontal>
          <List.Item>{shift.location}</List.Item>
          <List.Item>{shift.room}</List.Item>
          <List.Item>{shift.license}</List.Item>
          <List.Item>{format(shift.start, "HH:mm")}</List.Item>
          <List.Item>{format(shift.end, "HH:mm")}</List.Item>
          <List.Item>{shift.room}</List.Item>
        </List>
      </Segment>
    </Segment.Group>
  );
};

export default ShiftDayListItem;
