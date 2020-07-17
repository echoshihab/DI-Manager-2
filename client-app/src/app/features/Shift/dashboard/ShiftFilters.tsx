import React, { Fragment, useContext, useState } from "react";
import { Calendar } from "react-widgets";
import {
  Menu,
  Header,
  Button,
  Dropdown,
  Container,
  Divider,
  Form,
} from "semantic-ui-react";
import { CalendarView } from "react-widgets/lib/Calendar";
import { RootStoreContext } from "../../../stores/rootStore";
import { observer } from "mobx-react-lite";

interface IProps {
  view: string;
}

const ShiftFilters: React.FC<IProps> = ({ view }) => {
  const rootStore = useContext(RootStoreContext);
  const { setPredicate } = rootStore.shiftStore;
  const { sortedTechnologistByInitial } = rootStore.technologistStore;
  const { sortedLocationByName } = rootStore.locationStore;
  const { sortedLicenseByName } = rootStore.licenseStore;
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
        <Form>
          <Menu.Item>
            <Dropdown
              fluid
              button
              basic
              floating
              placeholder="Technologist"
              options={sortedTechnologistByInitial.map((technologist) => {
                return {
                  key: technologist.id,
                  value: technologist.id,
                  text: `${technologist.name} (${technologist.initial})`,
                };
              })}
            />
          </Menu.Item>
          <Menu.Item>
            <Dropdown
              fluid
              button
              basic
              floating
              placeholder="Location"
              options={sortedLocationByName.map((location) => {
                return {
                  key: location.id,
                  value: location.id,
                  text: location.name,
                };
              })}
            />
          </Menu.Item>
          <Menu.Item>
            <Dropdown
              button
              basic
              fluid
              floating
              placeholder="License"
              options={sortedLicenseByName.map((license) => {
                return {
                  key: license.id,
                  value: license.id,
                  text: license.displayName,
                };
              })}
            />
          </Menu.Item>

          <Menu.Item>
            <Button>Apply</Button>
            <Button>Reset</Button>
          </Menu.Item>
        </Form>
      </Menu>
    </Fragment>
  );
};

export default observer(ShiftFilters);
