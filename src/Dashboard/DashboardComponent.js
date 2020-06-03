import React from "react";
import "./Dashboard.scss";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Alerts, normaliseDate } from "../Utils/Auth";

export const Jumbotron = (props) => {
  return (
    <React.Fragment>
      <div className="jumbotron">
        <h2 className="display-4">Ooops, Sorry !</h2>
        <p className="lead">Seems like you have no Books available</p>
        <hr className="my-4" />
        <p>Go ahead and Add Books</p>
        <p className="lead">
          <span
            className="btn btn-success btn-lg"
            onClick={props.Toggle}
            role="button"
          >
            Add Books
          </span>
        </p>
      </div>
    </React.Fragment>
  );
};

export const CardComponent = (props) => {
  return (
    <React.Fragment>
      <div
        className="container-fluid books"
        key={props.ObjectsListId}
        id={props.keys}
      >
        <div className="row">
          <div className="col-12 mt-3">
            <div className="card">
              <div className="card-horizontal">
                <div className="img-square-wrapper">
                  {props.status > 0 &&
                  props.editMode === "yes" &&
                  props.ObjectsListId === props.bookId ? (
                    <img src={props.image} alt="" />
                  ) : (
                    false
                  )}

                  <img src={props.ObjectsListImage} alt="" />
                </div>
                <div className="card-body">
                  {props.editMode === "yes" &&
                  props.ObjectsListId === props.bookId ? (
                    <React.Fragment>
                      Title:
                      <input
                        className="form-control"
                        type="text"
                        name="title"
                        id="name"
                        placeholder="John Doe"
                        defaultValue={props.ObjectsListTitle}
                        onChange={props.handleChange}
                      />
                    </React.Fragment>
                  ) : (
                    <h4 className="card-text">
                      <b>{props.ObjectsListTitle}</b>
                    </h4>
                  )}
                  {props.editMode === "yes" &&
                  props.ObjectsListId === props.bookId ? (
                    <React.Fragment>
                      Author:
                      <input
                        className="form-control"
                        type="text"
                        name="author"
                        id="name"
                        placeholder="Ann-Marrie"
                        defaultValue={props.ObjectsListAuthor}
                        onChange={props.handleChange}
                      />
                    </React.Fragment>
                  ) : (
                    <h4 className="card-text">
                      <b>Authored By:</b> {props.ObjectsListAuthor}
                    </h4>
                  )}
                  {props.editMode === "yes" &&
                  props.ObjectsListId === props.bookId ? (
                    <React.Fragment>
                      ISBN:
                      <input
                        className="form-control"
                        type="text"
                        name="isbn"
                        id="name"
                        placeholder="978-0-306-40615-7"
                        defaultValue={props.ObjectsListIsbn}
                        onChange={props.handleChange}
                      />
                    </React.Fragment>
                  ) : (
                    <h4 className="card-title">
                      <b>ISBN</b>: {props.ObjectsListIsbn}
                    </h4>
                  )}
                </div>
              </div>
              <div className="card-footer row" key={props.ObjectsListId}>
                <div className=" col-md-4" key={props.ObjectsListId}>
                  {props.editMode === "yes" &&
                  props.ObjectsListId === props.bookId ? (
                    <React.Fragment>
                      <input
                        key={props.ObjectsListId}
                        className="form-control"
                        type="file"
                        name="image"
                        id={`image-` + props.ObjectsListId}
                        accept=".jpg, .svg , .png"
                        onChange={props.imageUpload}
                      />
                      {props.status < 100 && props.status > 0 ? (
                        <progress value={props.status} max="100" />
                      ) : (
                        false
                      )}
                    </React.Fragment>
                  ) : (
                    <small className="text-muted">
                      Created On
                      {normaliseDate(props.ObjectsListCreatedAt)}
                    </small>
                  )}
                </div>
                <div className="col-md-4 edit" onClick={props.editClick}>
                  {props.editMode === "yes" &&
                  props.ObjectsListId === props.bookId
                    ? "Cancel"
                    : "Edit"}
                </div>
                {props.editMode === "yes" &&
                props.ObjectsListId === props.bookId ? (
                  <input
                    className="btn btn-md btn-success delete"
                    onClick={props.submitEditBookData}
                    type="submit"
                    disabled={props.buttonLoading === true}
                    value={props.buttonLoading === false ? "Submit" : "loading"}
                  />
                ) : (
                  <div className="col-md-4 delete">Delete</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {props.server_errors === 409 ? (
        <Alerts
          color={"warning"}
          text={"Book Is Already in our system, please adjust ISBN"}
        />
      ) : (
        ""
      )}
    </React.Fragment>
  );
};
export default CardComponent;
