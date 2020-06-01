import React from "react";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Books Management App
        <br />
        <br />
        <a href="/login" className="btn btn-success">
          Login
        </a>
        <br />
        <br />
        <a href="/register" className="btn btn-primary">
          Register
        </a>
      </header>
    </div>
  );
}

export default App;
