import React from "react";
import PropTypes from "prop-types";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Alerts, errorMessage } from "../Utils/Auth";
import "./Login.scss";

const LoginComponent = (props) => {
  return (
    <span className="login">
      <div className="signup__container">
        <div className="container__child signup__form">
          <h3 className="text-center" style={{ color: "rgba(0, 0, 0, 0.685)" }}>
            Login
          </h3>
          <br />
          <form onSubmit={props.submitUserLoginForm} autoComplete="on">
            <div className="form-group">
              <label htmlFor="email">* Email</label>
              <input
                className="form-control"
                type="text"
                name="email"
                id="email"
                autoComplete="on"
                placeholder="you@email.com"
                value={props.email}
                onChange={props.handleChange}
              />
              {errorMessage(props.emailError)}
            </div>
            <div className="form-group">
              <label htmlFor="password">* Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                id="password"
                autoComplete="on"
                placeholder="Must have atleast 8 characters, Special character , atleast 1 uppercase"
                value={props.password}
                onChange={props.handleChange}
              />
              {errorMessage(props.passwordError)}
            </div>
            {props.server_errors === 400 ? (
              <Alerts
                color={"danger"}
                text={
                  "User with credentials doesnt exist in our system. Please check your password or username"
                }
              />
            ) : (
              ""
            )}
            {props.success === "true" ? (
              <Alerts color={"success"} text={"Welcome back."} />
            ) : (
              ""
            )}
            <div className="m-t-lg">
              <ul className="list-inline">
                <li>
                  <input
                    className="btn btn--form"
                    type="submit"
                    disabled={props.buttonLoading === true}
                    value={props.buttonLoading === false ? "Login" : "loading"}
                  />
                </li>
                <li>
                  <a className="signup__link" href="/register">
                    I don't have an account
                  </a>
                  <br />
                  <a className="signup__link" href="/">
                    Home
                  </a>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </span>
  );
};

LoginComponent.propTypes = {
  submitUserLoginForm: PropTypes.func,
  buttonLoading: PropTypes.bool,
  success: PropTypes.string,
  server_errors: PropTypes.string,
  passwordError: PropTypes.string,
  emailError: PropTypes.string,
  email: PropTypes.string,
  password: PropTypes.string,
  handleChange: PropTypes.func,
};
export default LoginComponent;
