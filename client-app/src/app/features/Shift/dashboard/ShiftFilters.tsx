import React, { Fragment, useContext, useState } from "react";
import { Calendar } from "react-widgets";
import { Menu, Header, Button } from "semantic-ui-react";
import { CalendarView } from "react-widgets/lib/Calendar";
import { RootStoreContext } from "../../../stores/rootStore";
import { observer } from "mobx-react-lite";

interface IProps {
  view: string;
}

const ShiftFilters: React.FC<IProps> = ({ view }) => {
  const rootStore = useContext(RootStoreContext);
  const { setPredicate } = rootStore.shiftStore;
  const [date, setDate] = useState(new Date());

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
          onChange={(date) => setDate(date!)}
          value={date}
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

export default observer(ShiftFilters);
