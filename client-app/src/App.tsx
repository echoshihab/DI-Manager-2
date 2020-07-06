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

const App = () => {
  // const rootStore = useContext(RootStoreContext);
  // const { loadShifts } = rootStore.shiftStore;

  // useEffect(() => {
  //   loadShifts();
  // }, [loadShifts]);

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
