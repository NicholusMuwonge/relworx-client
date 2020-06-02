import React from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./Add.scss";
import { Alerts, errorMessage } from "../Utils/Auth";

const AddComponent = (props) => {
  return (
    <React.Fragment>
      <div  id="myModal">
        <div >
          <div >
            <div className="signup__container">
              <div className="container__child signup__form">
                <h3
                  className="text-center"
                  style={{ color: "rgba(0, 0, 0, 0.685)" }}
                >
                  Add A Book
                </h3>
                <br />
                <form onSubmit={props.submitBookdata} autoComplete="on">
                  <div className="form-group">
                    <label htmlFor="name">Title</label>
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      id="name"
                      placeholder="Harry Porter"
                      autoComplete="on"
                      value={props.title}
                      onChange={props.handleChange}
                    />
                    {errorMessage(props.titleError)}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Author</label>
                    <input
                      className="form-control"
                      type="text"
                      name="author"
                      id="email"
                      autoComplete="on"
                      placeholder=" Ann Marie"
                      value={props.author}
                      onChange={props.handleChange}
                    />
                    {errorMessage(props.authorError)}
                  </div>
                  <div className="form-group">
                    <label htmlFor="password"> ISBN</label>
                    <input
                      className="form-control"
                      type="text"
                      name="isbn"
                      id="password"
                      autoComplete="on"
                      placeholder="99921-58-10-7"
                      value={props.isbn}
                      onChange={props.handleChange}
                    />
                    {errorMessage(props.isbnError)}
                  </div>
                  <h6
                    className="text"
                    style={{
                      color: "rgba(0, 0, 0, 0.685)",
                      fontWeight: "bolder",
                    }}
                  >
                    <div className="form-group">
                      <label htmlFor="image">Image</label>
                      <input
                        className="form-control"
                        type="file"
                        name={props.image}
                        id=""
                        accept=".jpg, .svg , .png, .jpeg"
                        onChange={props.uploadImage}
                      />
                      <img
                        src={props.image}
                        alt=""
                        width="140rem"
                        height="90rem"
                      />
                      <progress value={props.status} max="100" />
                    </div>
                  </h6>
                  {props.server_errors === 409 ? (
                    <Alerts
                      color={"warning"}
                      text={"Book Is Already in our system, edit your ISBN Field please"}
                    />
                  ) : (
                    ""
                  )}
                  {props.success === "true" ? (
                    <Alerts color={"success"} text={"Book Added sucessfully"} />
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
                          value={
                            props.buttonLoading === false ? "Add" : "loading"
                          }
                        />
                        <span></span>
                      </li>
                    </ul>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddComponent;
