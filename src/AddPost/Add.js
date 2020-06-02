import React from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./Add.scss";
import axios from "axios";
import firebase from "../Firebase/Firebase";
import AddComponent from "./AddComponent";

class AddBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        title: "",
        author: "",
        isbn: "",
      },
      errors: { undefined },
      status: 0,
      image: "",
      server_errors: "",
      success: "false",
      buttonLoading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitBookdata = this.submitBookdata.bind(
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

  submitBookdata(e) {
    e.preventDefault();
      this.makePost();
  }

  makePost() {
    const postUrl = "http://127.0.0.1:5000/api/books/create";
    this.setState({ buttonLoading: true });
    axios
      .post(
        postUrl,
        {
          title: this.state.fields.title,
          author: this.state.fields.author,
          isbn: this.state.fields.isbn,
          image: this.state.image===""?"https://picsum.photos/200/300":this.state.image,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((result) => {
        if (result.status === 201) {
          this.setState({ success: "true" });
          this.setState({ buttonLoading: false });
          setTimeout(() => {
            window.location.reload();
        }, 3000)
         
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

    if (13>fields["isbn"].length>20) {
      formIsValid = false;
      errors["isbn"] = "*Please enter atleat 13 characters and atmost 20 characters.";
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
        <AddComponent
        submitBookdata={this.submitBookdata}
        title={this.state.fields.title}
        handleChange={this.handleChange}
        titleError={this.state.errors.title}
        authorError={this.state.errors.author}
        isbnError={this.state.errors.isbn}
        author={this.state.fields.author}
        isbn={this.state.fields.isbn}
        image={this.state.image}
        buttonLoading={this.state.buttonLoading}
        uploadImage={event=>this.uploadImage(event.target.files)}
        status={this.state.status}
        server_errors={this.state.server_errors}
        success={this.state.success}
        />
        </React.Fragment>
    );
  }
}

export default AddBook;
