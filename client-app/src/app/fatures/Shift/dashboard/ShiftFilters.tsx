import React, { Fragment } from "react";
import { Calendar } from "react-widgets";
import { Menu, Header } from "semantic-ui-react";
import { CalendarView } from "react-widgets/lib/Calendar";

interface IProps {
  view: string;
}
const ShiftFilters: React.FC<IProps> = ({ view }) => {
  const params: CalendarView[] =
    view === "Month" ? ["year", "decade"] : ["month", "decade", "year"];
  return (
    <Fragment>
      <Menu vertical size={"large"}>
        <Header icon={"filter"} attached color={"black"} content={"Filters"} />

        <Header
          icon={"calendar"}
          attached
          color={"black"}
          content={`Select ${view}`}
        />
        <Calendar
          views={params}
          onChange={(date: any) => console.log(date)}
          footer={false}
        />
        <Menu.Item content={"All"} />
        <Menu.Item content={"Select Technologist"} />
        <Menu.Item content={"Select Exam Type"} />
      </Menu>
    </Fragment>
  );
};

export default ShiftFilters;
