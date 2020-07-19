import React, { Fragment, useContext, useState, SyntheticEvent } from "react";
import { Calendar } from "react-widgets";
import { Menu, Header, Button, Dropdown } from "semantic-ui-react";
import { CalendarView } from "react-widgets/lib/Calendar";
import { RootStoreContext } from "../../../stores/rootStore";
import { observer } from "mobx-react-lite";
import {
  filterLocation,
  filterLicense,
  filterTechnologist,
  filterDate,
} from "../../../helpers/util";

interface IProps {
  view: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShiftFilters: React.FC<IProps> = ({ view, setLoading }) => {
  const rootStore = useContext(RootStoreContext);
  const { setPredicate, loadShifts, clearPredicate } = rootStore.shiftStore;
  const { sortedTechnologistByInitial } = rootStore.technologistStore;
  const { sortedLocationByName } = rootStore.locationStore;
  const { sortedLicenseByName } = rootStore.licenseStore;

  const params: CalendarView[] =
    view === "Month" ? ["year", "decade"] : ["month", "decade", "year"];

  const [date, setDate] = useState(new Date());
  const [technologist, setTechnologist] = useState("");
  const [location, setLocation] = useState("");
  const [license, setLicense] = useState("");

  const handleChange = (e: SyntheticEvent, data: any) => {
    switch (data.name) {
      case "location":
        setLocation(data.value);
        break;
      case "license":
        setLicense(data.value);
        break;
      case "technologist":
        setTechnologist(data.value);
    }
  };

  const handleClear = () => {
    setLocation("");
    setLicense("");
    setTechnologist("");
    setDate(new Date());
  };

  const handleApply = () => {
    clearPredicate();
    setLoading(true);
    if (location.length > 0) setPredicate(filterLocation, location);
    if (license.length > 0) setPredicate(filterLicense, license);
    if (technologist.length > 0) setPredicate(filterTechnologist, technologist);

    setPredicate(filterDate, date);
    loadShifts().finally(() => setLoading(false));
  };

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

        <Menu.Item>
          <Dropdown
            fluid
            button
            basic
            floating
            name="technologist"
            onChange={handleChange}
            value={technologist}
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
            onChange={handleChange}
            floating
            value={location}
            name="location"
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
            value={license}
            onChange={handleChange}
            name="license"
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
          <Button basic color="grey" onClick={handleApply}>
            Apply
          </Button>
          <Button basic color="grey" onClick={handleClear}>
            Clear
          </Button>
        </Menu.Item>
      </Menu>
    </Fragment>
  );
};

export default observer(ShiftFilters);
