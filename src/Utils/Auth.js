import { Redirect } from "react-router";
import React, { useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Alert } from "reactstrap";
import moment from "moment";

export const Authenticated = Component => props =>
  sessionStorage.getItem("isLoggedIn") ? (
    <Component {...props} />
  ) : (
    <Redirect to="/login" />
  );

export const AlreadyAuthenticated = Component => props =>
  !sessionStorage.getItem("isLoggedIn") ? (
    <Component {...props} />
  ) : (
    <Redirect to="/dashboard" />
  );

export const errorMessage = item => (
  <h6
    className="errorMsg text-center"
    style={{ color: "red", fontSize: "14px" }}
  >
    {item}
  </h6>
);

export const Alerts = props => {
  const [visible, setVisible] = useState(true);

  const onDismiss = () => setVisible(false);

  return (
    <Alert color={props.color} isOpen={visible} toggle={onDismiss}>
      {props.text}
    </Alert>
  );
};

export var normaliseDate = date => {
  return moment(date).format("DD.MM.YYYY");
};
