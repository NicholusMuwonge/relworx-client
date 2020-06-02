import React from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";
import { AlreadyAuthenticated } from "../Utils/Auth";
import "./SignUp.scss";
import SignUpComponent from "./SignUpComponent";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        username: "",
        email: "",
        password: "",
        password1: "",
      },
      errors: {},
      success: "false",
      server_errors: "",
      buttonLoading: false,
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
        fields,
      },
      () => {
        this.validateForm();
      }
    );
  }

  submituserRegistrationForm(e) {
    e.preventDefault();
    this.makePost();
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
        password: this.state.fields.password,
      })
      .then((result) => {
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
      .catch((err) => {
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
      errors: errors,
    });
    return formIsValid;
  }

  render() {
    return (
      <SignUpComponent
        submituserRegistrationForm={this.submituserRegistrationForm}
        username={this.state.fields.username}
        email={this.state.fields.email}
        password={this.state.fields.password}
        password1={this.state.fields.password1}
        handleChange={this.handleChange}
        usernameError={this.state.errors.username}
        emailError={this.state.errors.email}
        passwordError={this.state.errors.password}
        password1Error={this.state.errors.password1}
        server_errors={this.state.server_errors}
        success={this.state.success}
        buttonLoading={this.state.buttonLoading}
      />
    );
  }
}

export default AlreadyAuthenticated(SignUp);
