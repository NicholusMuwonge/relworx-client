import React from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Alerts, errorMessage } from "../Utils/Auth";
import "./SignUp.scss";

const SignUpComponent = (props) => {
  return (
    <div className="signup__page">
      <div className="signup__container">
        <div className="container__child signup__form">
          <h3 className="text-center" style={{ color: "rgba(0, 0, 0, 0.685)" }}>
            SignUp
          </h3>
          <br />
          <form onSubmit={props.submituserRegistrationForm} autoComplete="on">
            <div className="form-group">
              <label htmlFor="name">* Userame</label>
              <input
                className="form-control"
                type="text"
                name="username"
                id="name"
                placeholder="John Doe"
                autoComplete="on"
                value={props.username}
                onChange={props.handleChange}
              />
              {errorMessage(props.usernameError)}
            </div>

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
            <div className="form-group">
              <label htmlFor="passwordRepeat"> Repeat Password</label>
              <input
                className="form-control"
                type="password"
                name="password1"
                id="passwordRepeat"
                autoComplete="on"
                placeholder="Please re-enter the password above"
                value={props.password1}
                onChange={props.handleChange}
              />
              {errorMessage(props.password1Error)}
            </div>
            {props.server_errors === 409 ? (
              <Alerts
                color={"warning"}
                text={
                  "User Seems to be Already signed up. Please Try signing in instead"
                }
              />
            ) : (
              ""
            )}
            {props.success === "true" ? (
              <Alerts
                color={"success"}
                text={
                  "You are all set you will be redirected to the login shortly."
                }
              />
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
                    onClick={props.submituserRegistrationForm}
                    value={
                      props.buttonLoading === false ? "Register" : "loading"
                    }
                  />
                </li>
                <li>
                  <a className="signup__link" href="/login">
                    I am already a member
                  </a>
                  <br/>
                  <a className="signup__link" href="/">
                      Home
                  </a>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpComponent;
