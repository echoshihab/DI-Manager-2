import React, { Fragment, useContext, useEffect } from "react";
import "./App.css";

import HomePage from "./app/features/home/HomePage";
import { Route, Switch, RouteComponentProps } from "react-router-dom";
import ShiftDashboard from "./app/features/Shift/dashboard/ShiftDashboard";
import NavBar from "./app/layout/NavBar";
import { observer } from "mobx-react-lite";
import NotFound from "./app/layout/NotFound";
import { Container } from "semantic-ui-react";
import AdminDashboard from "./app/features/admin/dashboard/AdminDashboard";
import { ToastContainer } from "react-toastify";
import ModalContainer from "./app/common/ModalContainer";
import { RootStoreContext } from "./app/stores/rootStore";
import LoadingComponent from "./app/layout/LoadingComponent";

const App = () => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [getUser, setAppLoaded, token]);

  if (!appLoaded) return <LoadingComponent content="Loading App..." />;
  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position="bottom-right" />

      <Container fluid>
        <Route exact path="/" component={HomePage} />
        <Route
          path={"/(.+)"}
          render={() => (
            <Fragment>
              <NavBar />
              <Switch>
                <Route
                  path="/monthview"
                  component={(props: RouteComponentProps<any>) => (
                    <ShiftDashboard {...props} view={"Month"} />
                  )}
                />
                <Route
                  path="/dayview"
                  component={(props: RouteComponentProps<any>) => (
                    <ShiftDashboard {...props} view={"Date"} />
                  )}
                />
                <Route path="/admin" component={AdminDashboard} />
                <Route component={NotFound} />
              </Switch>
            </Fragment>
          )}
        />
      </Container>
    </Fragment>
  );
};

export default observer(App);
