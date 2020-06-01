import React from 'react';
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";
import { AlreadyAuthenticated, errorMessage } from "../Utils/Auth";
import { Alert } from 'reactstrap';
import jwt from "jwt-decode";
import './Login.scss';


const AlertExample = (props) => {
  const [visible, setVisible] = React.useState(true);

  const onDismiss = () => setVisible(false);

  return (
    <Alert color={props.color} isOpen={visible} toggle={onDismiss}>
      {props.text}
    </Alert>
  );
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
      "email":"",
      "password": ""
      },
      errors: {},
      buttonLoading: false,
      server_errors:"",
      success:"false",
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
      }
    );
  }

  submituserRegistrationForm(e) {
    e.preventDefault();
    this.makePost();
  }

  makePost(){
    const postUrl = 'http://127.0.0.1:5000/api/users/login'
    this.setState({buttonLoading:true})
    axios.post(postUrl,{
      email:this.state.fields.email,
      password:this.state.fields.password,
    }).then(
    result => {
    if(result.status===200){
      const user = jwt(result.data.token)
      this.setState({success:"true"})
      this.setState({buttonLoading:false})
      sessionStorage.setItem("token", result.data.token);
      sessionStorage.setItem("username", result.data.username);
      sessionStorage.setItem("id", user.id + 1000000);
      sessionStorage.setItem("isLoggedIn", true);
      setTimeout(() => {
        window.location.replace('/dashboard')
    }, 3000)
    }else{
      this.setState({success:"false"})
    }
    }
).catch(
    err => {
      if(typeof err==="object"){
        this.setState({server_errors:err.response.status})
        this.setState({buttonLoading:false})
    }
  })}

  buttons =(onSubmit, buttonLoading) => {
    return (
      <React.Fragment>
        <div className="buttons">
          <button type="submit" onClick={onSubmit} disabled={buttonLoading} className="btn btn-primary btn-lg">
            {buttonLoading && (<i className="spinner-grow spinner-grow-sm" />)}
            {buttonLoading && <span>Just A sec Please!...</span>}
            {!buttonLoading && <span>Update Profile</span>}
          </button>
        </div>
      </React.Fragment>
    );
  }
  render() {
    return (
    <span className="login">
      <div className="signup__container">
        <div className="container__child signup__form">
          <h3 className="text-center" style={{ color: "rgba(0, 0, 0, 0.685)" }}>
            Login
          </h3>
          <br />
          <form onSubmit={this.submituserRegistrationForm} autoComplete="on">
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
            {(this.state.server_errors===400)?
            <AlertExample color={"danger"}
            text={"User with credentials doesnt exist in our system. Please check your password or username"} 
            />
            :"" }
            {this.state.success==="true"?(
            <AlertExample color={"success"}
            text={"Welcome back."}
            />
            ):""
          }
            <div className="m-t-lg">
              <ul className="list-inline">
                <li>
                  <input
                    className="btn btn--form"
                    type="submit"
                    disabled={this.state.buttonLoading===true}
                    value={this.state.buttonLoading===false?"Login":"loading"}
                  />
                </li>
                <li>
                  <a className="signup__link" href="/register">
                    I don't have an account
                  </a>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>
      </span>
    );
  }
}

export default AlreadyAuthenticated(Login);

