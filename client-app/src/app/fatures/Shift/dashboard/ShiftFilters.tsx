import React, { Fragment } from "react";
import { Calendar } from "react-widgets";
import { Menu, Header } from "semantic-ui-react";

const ShiftFilters = () => {
  return (
    <Fragment>
      <Menu
        vertical
        size={"large"}
        style={{ width: "60%", height: "100%", float: "right" }}
      >
        <Header icon={"filter"} attached color={"black"} content={"Filters"} />

        <Header
          icon={"calendar"}
          attached
          color={"black"}
          content={"Select Month"}
        />
        <Calendar
          views={["year", "decade"]}
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
