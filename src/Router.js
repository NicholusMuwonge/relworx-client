import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import App from "./App";
import "./App.css";

const Routes = () => (
  <React.Fragment>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
      </Switch>
    </BrowserRouter>
  </React.Fragment>
);

export default Routes;
