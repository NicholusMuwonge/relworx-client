import React from 'react';
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";
import { AlreadyAuthenticated, Alerts, errorMessage } from "../Utils/Auth";
import './SignUp.scss';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        username: "",
        email: "",
        password: "",
        password1: ""
      },
      errors: {},
      success: "false",
      server_errors: "",
      buttonLoading: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.submituserRegistrationForm = this.submituserRegistrationForm.bind(
      this
    );
  }

  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState(
      {
        fields
      },
      () => {
        this.validateForm();
      }
    );
  }

  submituserRegistrationForm(e) {
    e.preventDefault();
    if (this.validateForm()) {
      this.makePost();
    }
  }

  makePost() {
    const postUrl = "http://127.0.0.1:5000/api/users/register";
    this.setState({ buttonLoading: true });
    axios
      .post(postUrl, {
        username: this.state.fields.username,
        email: this.state.fields.email,
        password: this.state.fields.password
      })
      .then(result => {
        if (result.status === 201) {
          this.setState({ success: "true" });
          this.setState({ buttonLoading: false });
          setTimeout(() => {
            this.props.history.push("/login");
          }, 5000);
        } else {
          this.setState({ success: "false" });
        }
      })
      .catch(err => {
        if (typeof err === "object") {
          this.setState({ server_errors: err.response.status });
          this.setState({ buttonLoading: false });
        }
      });
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["username"]) {
      formIsValid = false;
      errors["username"] = "*Please enter your username.";
    }

    if (typeof fields["username"] !== "undefined") {
      if (!fields["username"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["username"] = "*Please enter alphabet characters only.";
      }
    }

    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "*Please enter your email-ID.";
    }

    if (typeof fields["email"] !== "undefined") {
      //regular expression for email validation
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(fields["email"])) {
        formIsValid = false;
        errors["email"] = "*Please enter valid email-ID.";
      }
    }

    if (this.state.server_errors === 409) {
      formIsValid = false;
      errors["email"] =
        "*User Seems to be Already signed up. Please Try signing in";
    }
    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "*Please enter your password.";
    }

    if (fields["password"] !== fields["password1"]) {
      formIsValid = false;
      errors["password1"] = "*Passwords do not match.";
    }

    if (typeof fields["password"] !== "undefined") {
      if (
        !fields["password"].match(
          /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/
        )
      ) {
        formIsValid = false;
        errors["password"] = "*Please enter secure and strong password.";
      }
    }

    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  render() {
    return (
      <div className="signup__container">
        <div className="container__child signup__form">
          <h3 className="text-center" style={{ color: "rgba(0, 0, 0, 0.685)" }}>
            SignUp
          </h3>
          <br />
          <form onSubmit={this.submituserRegistrationForm} autoComplete="on">
            <div className="form-group">
              <label htmlFor="name">* Userame</label>
              <input
                className="form-control"
                type="text"
                name="username"
                id="name"
                placeholder="John Doe"
                autoComplete="on"
                value={this.state.fields.username}
                onChange={this.handleChange}
              />
              {errorMessage(this.state.errors.username)}
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
                value={this.state.fields.email}
                onChange={this.handleChange}
              />
              {errorMessage(this.state.errors.email)}
            </div>
            <div className="form-group">
              <label htmlFor="password">* Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                id="password"
                autoComplete="on"
                placeholder="Must have atleast 8 characters, Special charrater , atleast 1 upporcase"
                value={this.state.fields.password}
                onChange={this.handleChange}
              />
              {errorMessage(this.state.errors.password)}
            </div>
            <div className="form-group">
              <label htmlFor="passwordRepeat">* Repeat Password</label>
              <input
                className="form-control"
                type="password"
                name="password1"
                id="passwordRepeat"
                autoComplete="on"
                placeholder="Please re-enter the password above"
                value={this.state.fields.password1}
                onChange={this.handleChange}
              />
              {errorMessage(this.state.errors.password1)}
            </div>
            {this.state.server_errors === 409 ? (
              <Alerts
                color={"warning"}
                text={
                  "User Seems to be Already signed up. Please Try signing in instead"
                }
              />
            ) : (
              ""
            )}
            {this.state.success === "true" ? (
              <Alerts
                color={"success"}
                text={
                  "Looks like you are all set you will be redirected to the login shortly."
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
                    disabled={this.state.buttonLoading === true}
                    value={
                      this.state.buttonLoading === false
                        ? "Register"
                        : "loading"
                    }
                  />
                </li>
                <li>
                  <a className="signup__link" href="/login">
                    I am already a member
                  </a>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AlreadyAuthenticated(SignUp);

