import React from "react";
import "./Dashboard.scss";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";
import { Alerts, Authenticated } from "../Utils/Auth";
import firebase from "../Firebase/Firebase";
import AddBook from "../AddPost/Add";
import back from "./back-arrow.png";
import CardComponent, { Jumbotron } from "./DashboardComponent";

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
    this.submitEditBookData = this.submitEditBookData.bind(this);
  }
  handleChange(e) {
    let fields = this.state.fields;
    let images = this.state.image;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields,
      images,
    });

    if (e.target.files) {
      const image = e.target.files;
      this.setState(() => ({ image }));
    }
  }

  submitEditBookData(e) {
    e.preventDefault();
    this.makePost();
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
          image:
            this.state.image === ""
              ? this.state.placeholderImage
              : this.state.image,
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
          this.setState({ buttonLoading: false, status: 0 });
          this.setState({ editMode: false, image: "" });
          this.collectItems();
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
      .ref(`images/${files[0].name}`)
      .put(files[0]);
    fileload.then(() => {
      firebase
        .storage()
        .ref(`images/${files[0].name}`)
        .getDownloadURL()
        .then((url) => {
          this.setState({ image: url });
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
          className="logout btn btn--form"
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
            <img
              src={back}
              className="close-button"
              onClick={() => this.setState({ show: "no" })}
              alt=""
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <span>
              {this.state.success === "true" ? (
                <Alerts color={"success"} text={"Book Edited sucessfully"} />
              ) : (
                false
              )}
            </span>
            {this.state.noBookBanner === true ? (
              <Jumbotron Toggle={this.Toggle} />
            ) : (
              <div className="books">
                {Object.values(this.state.booksContainer).map(
                  (ObjectsList, key) => (
                    <React.Fragment key={key}>
                      <CardComponent
                        ObjectsListId={ObjectsList.id}
                        ObjectsListAuthor={ObjectsList.author}
                        ObjectsListTitle={ObjectsList.title}
                        ObjectsListIsbn={ObjectsList.isbn}
                        ObjectsListImage={ObjectsList.image}
                        ObjectsListCreatedAt={ObjectsList.createdAt}
                        editClick={(e) =>
                          this.editClick(e, ObjectsList, ObjectsList.id)
                        }
                        keys={key}
                        status={this.state.status}
                        editMode={this.state.editMode}
                        image={this.state.image}
                        bookId={this.state.bookId}
                        handleChange={this.handleChange}
                        imageUpload={(event) =>
                          this.uploadImage(event.target.files)
                        }
                        buttonLoading={this.state.buttonLoading}
                        submitEditBookData={this.submitEditBookData}
                        server_errors={this.state.server_errors}
                      />
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
              +
            </button>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default Authenticated(Dashboard);
