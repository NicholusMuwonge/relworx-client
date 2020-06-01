import React from "react";
import "./Dashboard.scss";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";
import { Alerts, Authenticated, normaliseDate } from "../Utils/Auth";
import firebase from "../Firebase/Firebase";
import AddBook from "../AddPost/Add";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      booksContainer: [],
      user: sessionStorage.getItem("id") - 1000,
      isloading: false,
      noBookBanner: false,
      show: "no",
      bookId: "",
      editMode: "no",
      fields: {
        title: "",
        author: "",
        isbn: "",
      },
      errors: { undefined },
      status: 0,
      image: "",
      placeholderImage: "",
      placeholderTitle: "",
      placeholderAuthor: "",
      placeholderIsbn: "",
      server_errors: "",
      success: "false",
      buttonLoading: false,
      deleteId: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitEditBookData = this.submitEditBookData.bind(
      this
    );
  }
  handleChange(e) {
    let fields = this.state.fields;
    let images = this.state.image;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields,
      images,
    });

    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({ image }));
    }
  }

  submitEditBookData(e) {
    e.preventDefault();
    this.makePost();
    if (this.validateForm()) {
      this.makePost();
    }
  }

  collectItems = () => {
    axios
      .get(`http://127.0.0.1:5000/api/books/`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.books.count < 1) {
          this.setState({ noBookBanner: true });
        } else {
          this.setState({ booksContainer: res.data.books.rows });
        }
      });
  };
  componentDidMount() {
    this.collectItems();
    setInterval(() => this.collectItems(), 30000);
  }
  Toggle = () => {
    const toggle = this.state.show === "no" ? "yes" : "no";
    this.setState({ show: toggle });
  };

  editClick = (e, item, key) => {
    e.preventDefault();
    this.setState({
      bookId: item.id,
      placeholderImage: item.image,
      placeholderTitle: item.title,
      placeholderAuthor: item.author,
      placeholderIsbn: item.isbn,
    });
    this.setState({
      task: this.state.booksContainer.filter((item) => item.key !== key),
      editMode: this.state.editMode === "yes" ? "no" : "yes",
    });
  };

  editToggle = () => {
    const Toggle = this.state.editMode === "yes" ? "no" : "yes";
    this.setState({ editMode: Toggle });
  };

  deleteBook = (id) => {
    const postUrl = `http://127.0.0.1:5000/api/books/${id}`;
    this.setState({ buttonLoading: true });
    axios
      .delete(postUrl, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((result) => {
        if (result.status === 200) {
          this.setState({ success: "true" });
          this.setState({ buttonLoading: false });
          this.setState({ editMode: false });
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
  };
  deleteAlert = (item) => {
    this.setState({ deleteId: item.id });
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.deleteBook,
        },
        {
          label: "No",
          onClick: () => alert("Click No"),
        },
      ],
    });
  };

  makePost() {
    const postUrl = `http://127.0.0.1:5000/api/books/${this.state.bookId}`;
    this.setState({ buttonLoading: true });
    axios
      .put(
        postUrl,
        {
          title:
            this.state.fields.title === ""
              ? this.state.placeholderTitle
              : this.state.fields.title,
          author:
            this.state.fields.author === ""
              ? this.state.placeholderAuthor
              : this.state.fields.author,
          isbn:
            this.state.fields.isbn === ""
              ? this.state.placeholderIsbn
              : this.state.fields.isbn,
          image: this.state.image,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((result) => {
        if (result.status === 200) {
          this.setState({ success: "true" });
          this.setState({ buttonLoading: false });
          this.setState({ editMode: false });
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
  uploadImage = (files) => {
    const fileload = firebase
      .storage()
      .ref(`images/${files[0].names}`)
      .put(files[0]);
    fileload.then(() => {
      firebase
        .storage()
        .ref(`images/${files[0].names}`)
        .getDownloadURL()
        .then((url) => {
          const image = {
            image: url,
          };
          this.setState({ image: image.image });
        });
    });
    fileload.on("state_changed", (snapshot) => {
      const status = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      this.setState({ status });
    });
  };

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (fields["title"].length < 3) {
      formIsValid = false;
      errors["title"] = "Please enter a valid book title atleast 3 characters";
    }
    if (!fields["title"]) {
      formIsValid = false;
      errors["title"] = "*Please enter book's title.";
    }
    if (!fields["author"]) {
      formIsValid = false;
      errors["author"] = "*Please enter book's author.";
    }
    if (!fields["isbn"]) {
      formIsValid = false;
      errors["isbn"] = "*Please enter book's isbn.";
    }
    if (this.state.server_errors === 409) {
      formIsValid = false;
      errors["isbn"] = "*Isbn seems to be already registered";
    }
    this.setState({
      errors: errors,
    });
    return formIsValid;
  }

  render() {
    return (
      <React.Fragment>
        <button
          className="logout btn btn-primary"
          onClick={() => {
            sessionStorage.clear();
            window.location.replace("/login");
          }}
        >
          Logout
        </button>
        {this.state.show === "yes" ? (
          <React.Fragment>
            <AddBook />
            <button
              type="button"
              class="btn btn-warning btn--form close-button"
              onClick={() => this.setState({ show: "no" })}
            >
              Close
            </button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <span>
              {this.state.success === "true" ? (
                <Alerts color={"success"} text={"Book Added sucessfully"} />
              ) : (
                false
              )}
            </span>
            {this.state.noBookBanner === true ? (
              <React.Fragment>
                <div class="jumbotron">
                  <h1 class="display-4 black">Ooops, Sorry !</h1>
                  <p class="lead">Seems like you have no Books available</p>
                  <hr class="my-4" />
                  <p>Go ahead and Add Books</p>
                  <p class="lead">
                    <span
                      class="btn btn-success btn-lg"
                      onClick={this.Toggle}
                      role="button"
                    >
                      Add Books
                    </span>
                  </p>
                </div>
              </React.Fragment>
            ) : (
              <div className="books">
                {Object.values(this.state.booksContainer).map(
                  (ObjectsList, key) => (
                    <React.Fragment>
                      <div class="container-fluid" key={ObjectsList.id}>
                        <div class="row">
                          <div class="col-12 mt-3">
                            <div class="card">
                              <div class="card-horizontal">
                                <div class="img-square-wrapper">
                                  {this.state.status > 0 &&
                                  this.state.editMode === "yes" &&
                                  ObjectsList.id === this.state.bookId ? (
                                    <img
                                      src={this.state.image}
                                      alt="Card cap"
                                    />
                                  ) : (
                                    false
                                  )}

                                  <img src={ObjectsList.image} alt="Card cap" />
                                </div>
                                <div class="card-body">
                                  {this.state.editMode === "yes" &&
                                  ObjectsList.id === this.state.bookId ? (
                                    <React.Fragment>
                                      Title:
                                      <input
                                        className="form-control"
                                        type="text"
                                        name="title"
                                        id="name"
                                        placeholder="John Doe"
                                        defaultValue={ObjectsList.title}
                                        onChange={(e) => this.handleChange(e)}
                                      />
                                    </React.Fragment>
                                  ) : (
                                    <h4 class="card-text">
                                      <b>{ObjectsList.title}</b>
                                    </h4>
                                  )}
                                  {this.state.editMode === "yes" &&
                                  ObjectsList.id === this.state.bookId ? (
                                    <React.Fragment>
                                      Author:
                                      <input
                                        className="form-control"
                                        type="text"
                                        name="author"
                                        id="name"
                                        placeholder="Ann-Marrie"
                                        defaultValue={ObjectsList.author}
                                        onChange={(e) => this.handleChange(e)}
                                      />
                                    </React.Fragment>
                                  ) : (
                                    <h4 class="card-text">
                                      <b>Authored By:</b> {ObjectsList.author}
                                    </h4>
                                  )}
                                  {this.state.editMode === "yes" &&
                                  ObjectsList.id === this.state.bookId ? (
                                    <React.Fragment>
                                      ISBN:
                                      <input
                                        className="form-control"
                                        type="text"
                                        name="isbn"
                                        id="name"
                                        placeholder="978-0-306-40615-7"
                                        defaultValue={ObjectsList.isbn}
                                        onChange={(e) => this.handleChange(e)}
                                      />
                                    </React.Fragment>
                                  ) : (
                                    <h4 class="card-title">
                                      <b>ISBN</b>: {ObjectsList.isbn}
                                    </h4>
                                  )}
                                </div>
                              </div>
                              <div
                                className="card-footer row"
                                key={ObjectsList.id}
                              >
                                <div class=" col-md-4" key={ObjectsList.id}>
                                  {this.state.editMode === "yes" &&
                                  ObjectsList.id === this.state.bookId ? (
                                    <React.Fragment>
                                      <input
                                        key={ObjectsList.id}
                                        className="form-control"
                                        type="file"
                                        name="image"
                                        id={`image-` + ObjectsList.id}
                                        accept=".jpg, .svg , .png"
                                        onChange={(event) =>
                                          this.uploadImage(event.target.files)
                                        }
                                      />
                                      {100 > this.state.status > 0 ? (
                                        <progress
                                          value={this.state.status}
                                          max="100"
                                        />
                                      ) : (
                                        false
                                      )}
                                    </React.Fragment>
                                  ) : (
                                    <small class="text-muted">
                                      Created On{" "}
                                      {normaliseDate(ObjectsList.createdAt)}
                                    </small>
                                  )}
                                </div>
                                <div
                                  className="col-md-4 edit"
                                  onClick={(e) =>
                                    this.editClick(
                                      e,
                                      ObjectsList,
                                      ObjectsList.id,
                                      ObjectsList.image,
                                      ObjectsList.title,
                                      ObjectsList.author,
                                      ObjectsList.isbn
                                    )
                                  }
                                >
                                  {this.state.editMode === "yes" &&
                                  ObjectsList.id === this.state.bookId
                                    ? "Cancel"
                                    : "Edit"}
                                </div>
                                {this.state.editMode === "yes" &&
                                ObjectsList.id === this.state.bookId ? (
                                  <input
                                    className="btn btn-md btn-success delete"
                                    onClick={this.submitEditBookData}
                                    type="submit"
                                    disabled={this.state.buttonLoading === true}
                                    value={
                                      this.state.buttonLoading === false
                                        ? "Submit"
                                        : "loading"
                                    }
                                  />
                                ) : (
                                  <div className="col-md-4 delete">Delete</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {this.state.server_errors === 409 ? (
                        <Alerts
                          color={"warning"}
                          text={"Book Is Already in our system"}
                        />
                      ) : (
                        ""
                      )}
                    </React.Fragment>
                  )
                )}
              </div>
            )}
            <button
              className="add-book"
              data-toggle="modal"
              data-target="#myModal"
              onClick={this.Toggle}
            >
              {" "}
              +{" "}
            </button>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default Authenticated(Dashboard);
