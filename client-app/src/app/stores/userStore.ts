import { RootStore } from "./rootStore";
import { observable, computed, action, runInAction } from "mobx";
import {
  IUser,
  IUserFormValues,
  IUserSlim,
  userRoleFormValues,
} from "../models/user";
import agent from "../api/agent";
import { history } from "../..";
import { admin } from "../helpers/util";
import { toast } from "react-toastify";

export default class UserStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable user: IUser | null = null;
  @observable roles: string[] = [];
  @observable userRegistry = new Map();
  @observable selectedUser: IUserSlim | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @computed get sortedUserByUserName() {
    return this.sortUserByUserName(Array.from(this.userRegistry.values()));
  }

  sortUserByUserName(users: IUserSlim[]) {
    const sortedUsers = users.sort((a, b) =>
      a.userName.localeCompare(b.userName)
    );
    return sortedUsers;
  }

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      if (this.rootStore.commonStore.role === admin) {
        history.push("/admin");
      } else {
        history.push("/dayview");
      }
    } catch (error) {
      throw error;
    }
  };

  @action register = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.register(values);
      runInAction(() => {
        this.rootStore.commonStore.setToken(user.token);
        this.rootStore.modalStore.closeModal();
        history.push("/dayview");
      });
    } catch (error) {
      throw error;
    }
  };

  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push("/");
  };

  @action getUser = async () => {
    try {
      const user = await agent.User.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
      toast.error("Authentication Problem - Please log in again");
    }
  };

  //role specific

  @action loadRoles = async () => {
    try {
      const userRoles = await agent.User.roles();
      runInAction(() => {
        this.roles = userRoles;
      });
    } catch (error) {
      toast.error("Unable to retrieve user roles");
    }
  };

  @action assignRole = async (formValues: userRoleFormValues) => {};

  @action loadUsers = async () => {
    this.userRegistry.clear();
    try {
      const users = await agent.User.list();
      runInAction("loading users", () => {
        users.forEach((user) => {
          this.userRegistry.set(user.userName, user);
        });
      });
    } catch (error) {
      toast.error("Unable to retrieve users");
    }
  };

  @action selectUser = (userName: string) => {
    this.selectedUser = this.userRegistry.get(userName);
  };
}
