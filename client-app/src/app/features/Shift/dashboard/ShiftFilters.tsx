import React, { Fragment, useContext } from "react";
import { Calendar } from "react-widgets";
import { Menu, Header, Button } from "semantic-ui-react";
import { CalendarView } from "react-widgets/lib/Calendar";
import { RootStoreContext } from "../../../stores/rootStore";

interface IProps {
  view: string;
}

const ShiftFilters: React.FC<IProps> = ({ view }) => {
  const rootStore = useContext(RootStoreContext);
  const { predicate, setPredicate } = rootStore.shiftStore;

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
          onChange={(date) => setPredicate("selectedDate", date!)}
          value={predicate.get("selectedDate") || new Date()}
          footer={false}
        />
        <Menu.Item content={"Select Technologist"} />
        <Menu.Item content={"Select Exam Type"} />
        <Menu.Item content={"Select Location"} />
        <Menu.Item>
          <Button>Apply Filters</Button>
        </Menu.Item>
      </Menu>
    </Fragment>
  );
};

export default ShiftFilters;
