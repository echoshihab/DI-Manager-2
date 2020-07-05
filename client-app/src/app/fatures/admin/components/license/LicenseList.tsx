import React, { useContext } from "react";
import { RootStoreContext } from "../../../../stores/rootStore";
import { List, Header } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import LicenseListItem from "./LicenseListItem";

const LicenseList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { sortedLicenseByName } = rootStore.licenseStore;

  return (
    <List divided relaxed>
      <Header content="Available Licenses" />

      {sortedLicenseByName.map((license) => (
        <List.Item key={license.id}>
          <List.Content>
            <LicenseListItem license={license} />
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

export default observer(LicenseList);
