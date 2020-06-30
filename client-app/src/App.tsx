import React, { Fragment, useContext, useEffect } from "react";
import "./App.css";

import { RootStoreContext } from "./app/stores/rootStore";
import HomePage from "./app/fatures/home/HomePage";
import { Route, Switch, RouteComponentProps } from "react-router-dom";
import ShiftDashboard from "./app/fatures/Shift/dashboard/ShiftDashboard";
import NavBar from "./app/layout/NavBar";
import { observer } from "mobx-react-lite";
import NotFound from "./app/layout/NotFound";
import { Container } from "semantic-ui-react";
import AdminDashboard from "./app/fatures/admin/dashboard/AdminDashboard";
import { ToastContainer } from "react-toastify";

const App = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadShifts } = rootStore.shiftStore;

  useEffect(() => {
    loadShifts();
  }, [loadShifts]);

  return (
    <Fragment>
      <ToastContainer position="bottom-right" />
      <NavBar />
      <Container fluid>
        <Switch>
          <Route exact path="/" component={HomePage} />
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
      </Container>
    </Fragment>
  );
};

export default observer(App);
