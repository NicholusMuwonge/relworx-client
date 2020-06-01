import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import App from "./App";
import "./App.scss";
import SignUp from "./SignUp/SignUp";
import Login from "./Login/Login";
import Dashboard from "./Dashboard/Dashboard";

const Routes = () => (
  <React.Fragment>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/register" component={SignUp} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  </React.Fragment>
);

export default Routes;
