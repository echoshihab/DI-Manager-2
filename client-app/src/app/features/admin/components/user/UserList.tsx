import React, { useContext } from "react";
import { RootStoreContext } from "../../../../stores/rootStore";
import { List, Header } from "semantic-ui-react";
import UserListItem from "./UserListItem";
import { observer } from "mobx-react-lite";

const UserList = () => {
  const rootStore = useContext(RootStoreContext);
  const { sortedUserByUserName } = rootStore.userStore;

  return (
    <List divided relaxed>
      <Header content="Available Users" />

      {sortedUserByUserName.map((user) => (
        <List.Item key={user.userName}>
          <List.Content>
            <UserListItem user={user} />
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

export default observer(UserList);
