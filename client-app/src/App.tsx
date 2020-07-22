import React, { Fragment } from "react";
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

const App = () => {
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
