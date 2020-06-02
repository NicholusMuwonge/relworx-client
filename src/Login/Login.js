import React from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";
import { AlreadyAuthenticated } from "../Utils/Auth";
import jwt from "jwt-decode";
import "./Login.scss";
import LoginComponent from "./LoginComponent";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        email: "",
        password: "",
      },
      errors: {},
      buttonLoading: false,
      server_errors: "",
      success: "false",
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitUserLoginForm = this.submitUserLoginForm.bind(this);
  }

  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields,
    });
  }

  submitUserLoginForm(e) {
    e.preventDefault();
    this.makePost();
  }

  makePost() {
    const postUrl = "http://127.0.0.1:5000/api/users/login";
    this.setState({ buttonLoading: true });
    axios
      .post(postUrl, {
        email: this.state.fields.email,
        password: this.state.fields.password,
      })
      .then((result) => {
        if (result.status === 200) {
          const user = jwt(result.data.token);
          this.setState({ success: "true" });
          this.setState({ buttonLoading: false });
          sessionStorage.setItem("token", result.data.token);
          sessionStorage.setItem("username", result.data.username);
          sessionStorage.setItem("isLoggedIn", true);
          setTimeout(() => {
            window.location.replace("/dashboard");
          }, 3000);
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

  render() {
    return (
      <LoginComponent
        submitUserLoginForm={this.submitUserLoginForm}
        email={this.state.fields.email}
        password={this.state.fields.password}
        handleChange={this.handleChange}
        emailError={this.state.errors.email}
        passwordError={this.state.errors.password}
        server_errors={this.state.server_errors}
        success={this.state.success}
        buttonLoading={this.state.buttonLoading}
      />
    );
  }
}

export default AlreadyAuthenticated(Login);
