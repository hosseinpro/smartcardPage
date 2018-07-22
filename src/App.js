import React, { Component } from "react";
import "./App.css";
import MainPage from "./components/MainPage";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="container">
          <h3 className="mt-4">SmartcardPage: Demo of smartcardBridge</h3>
          <h6>
            More info at
            <a
              href="https://github.com/hosseinpro/smartcardPage"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              smartcardPage at github
            </a>
          </h6>
          <MainPage smartcardBridgeAddress="http://localhost:3333" />
        </div>
      </div>
    );
  }
}

export default App;
