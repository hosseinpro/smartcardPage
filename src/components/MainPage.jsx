import React, { Component } from "react";

import {
  getVersion,
  listCardreaders,
  cardreaderConnect,
  cardreaderDisconnect,
  cardreaderTransmit
} from "../lib/smartcardBridgeClient";

class MainPage extends Component {
  constructor(props) {
    super();
    this.state.smartcardBridgeAddress = props.smartcardBridgeAddress;
  }

  state = {
    osName: "",
    smartcardBridgeAddress: "",
    isSmartcardBridgeAvailable: false,
    cardreaderList: [],
    selectedCardreader: "",
    isSmartcardConnected: false,
    protocol: 0,
    errorMessage: "",
    commandAPDU: "",
    responseAPDULog: ""
  };

  componentDidMount() {
    this.state.osName = this.getOSName();
    getVersion(this.state.smartcardBridgeAddress)
      .then(res => {
        this.setState({ isSmartcardBridgeAvailable: true });
        listCardreaders(this.state.smartcardBridgeAddress)
          .then(cardreaderList => {
            const selectedCardreader = cardreaderList[0];
            this.setState({ cardreaderList, selectedCardreader });
          })
          .catch(error => {
            this.setState({ errorMessage: error });
          });
      })
      .catch(error => {
        this.setState({ isSmartcardBridgeAvailable: false });
      });
  }

  getOSName() {
    let OSName = "";
    if (navigator.appVersion.indexOf("Win") !== -1) OSName = "Windows";
    if (navigator.appVersion.indexOf("Mac") !== -1) OSName = "MacOS";
    if (navigator.appVersion.indexOf("Linux") !== -1) OSName = "Linux";
    if (navigator.appVersion.indexOf("X11") !== -1) OSName = "UNIX";
    return OSName;
  }

  onChangeCardreaderList(e) {
    this.cardreaderDisconnect();
    this.setState({ selectedCardreader: e.target.value });
  }

  onClickConnectDisconnect() {
    if (this.state.isSmartcardConnected) {
      cardreaderDisconnect(
        this.state.smartcardBridgeAddress,
        this.state.selectedCardreader
      )
        .then(res => {
          this.setState({
            isSmartcardConnected: false,
            errorMessage: null
          });
        })
        .catch(error => {
          this.setState({ errorMessage: error });
        });
    } else {
      cardreaderConnect(
        this.state.smartcardBridgeAddress,
        this.state.selectedCardreader
      )
        .then(res => {
          this.setState({
            isSmartcardConnected: true,
            protocol: res.protocol,
            errorMessage: null
          });
        })
        .catch(error => {
          this.setState({ errorMessage: error });
        });
    }
  }

  onChangeCommandAPDU(e) {
    this.setState({ commandAPDU: e.target.value });
  }

  onClickTransmit(e) {
    cardreaderTransmit(
      this.state.smartcardBridgeAddress,
      this.state.selectedCardreader,
      this.state.protocol,
      this.state.commandAPDU
    )
      .then(res => {
        const responseAPDULog =
          this.state.responseAPDULog +
          ">" +
          this.state.commandAPDU +
          "\n<" +
          res.data.responseAPDU +
          "\n";
        this.setState({
          responseAPDULog
        });
      })
      .catch(error => {
        this.setState({ errorMessage: error });
      });
  }

  onClickClear(e) {
    this.setState({ responseAPDULog: "" });
  }

  render() {
    return (
      <div className="form-group">
        <div className="row col-xs-12">
          <div className="row mt-2 input-group">
            <label
              className="text-auto"
              hidden={this.state.isSmartcardBridgeAvailable ? false : true}
            >
              smartcardBridge is connected.
            </label>
            <div
              className="input-group"
              hidden={this.state.isSmartcardBridgeAvailable ? true : false}
            >
              <label className="text-danger form-control">
                smartcardBridge is not connected.{" "}
                {this.state.osName === "Windows"
                  ? "You must download and install smartcardBridge at first."
                  : "Your operating system (" +
                    this.state.osName +
                    ") is not supported."}
              </label>
              <div className="input-group-append">
                <a
                  hidden={this.state.osName !== "Windows" ? true : false}
                  className="btn btn-danger"
                  href={
                    this.state.osName === "Windows"
                      ? "https://github.com/hosseinpro/smartcardPage/raw/master/smartcardBridge/out/make/squirrel.windows/x64/smartcardbridge-1.0.0%20Setup.exe"
                      : ""
                  }
                  role="button"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
          <div className="row mt-2 input-group">
            <select
              className="custom-select"
              disabled={!this.state.isSmartcardBridgeAvailable ? true : false}
              onChange={this.onChangeCardreaderList.bind(this)}
            >
              {this.state.cardreaderList.map(readername => {
                return <option key={readername}>{readername}</option>;
              })}
            </select>
            <div className="input-group-append">
              <button
                className="btn btn-primary"
                disabled={!this.state.isSmartcardBridgeAvailable ? true : false}
                onClick={this.onClickConnectDisconnect.bind(this)}
              >
                {!this.state.isSmartcardConnected ? "Connect" : "Disconnect"}
              </button>
            </div>
          </div>
          <div className="row mt-2 input-group">
            <input
              type="text"
              className="form-control"
              onChange={this.onChangeCommandAPDU.bind(this)}
              disabled={!this.state.isSmartcardConnected}
            />
            <div className="input-group-append">
              <button
                className="btn btn-primary"
                onClick={this.onClickTransmit.bind(this)}
                disabled={!this.state.isSmartcardConnected}
              >
                Transmit
              </button>
            </div>
          </div>
          <div className="row mt-2" hidden={!this.state.errorMessage}>
            <label className="text-danger">{this.state.errorMessage}</label>
          </div>
          <div className="row mt-2 input-group">
            <textarea
              className="form-control"
              rows="10"
              readOnly
              value={this.state.responseAPDULog}
            />
            <div className="w-100" />
            <button
              className="btn btn-primary w-100"
              onClick={this.onClickClear.bind(this)}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default MainPage;
