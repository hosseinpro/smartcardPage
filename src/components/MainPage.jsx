import React, { Component } from "react";

import SmartcardBridgeClient from "../lib/smartcardBridgeClient";

class MainPage extends Component {
  constructor(props) {
    super();
    this.state.smartcardBridgeClient = new SmartcardBridgeClient(
      props.smartcardBridgeAddress
    );
  }

  state = {
    smartcardBridgeClient: null,
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
    window.addEventListener("beforeunload", this.componentCleanup.bind(this));
    this.setState({ osName: this.getOSName() });
    this.state.smartcardBridgeClient
      .getVersion()
      .then(res => {
        this.setState({ isSmartcardBridgeAvailable: true });
        this.state.smartcardBridgeClient
          .listCardreaders()
          .then(cardreaderList => {
            const selectedCardreader = cardreaderList[0];
            this.setState({ cardreaderList, selectedCardreader });
          })
          .catch(error => {
            this.setState({ errorMessage: error });
          });
      })
      .catch(error => {
        console.log(error);
        this.setState({ isSmartcardBridgeAvailable: false });
      });
  }

  componentCleanup() {
    this.state.smartcardBridgeClient
      .cardreaderDisconnect(this.state.selectedCardreader)
      .then(res => {
        this.setState({
          isSmartcardConnected: false,
          errorMessage: null
        });
      })
      .catch(error => {
        this.setState({ errorMessage: error });
      });
  }

  componentWillUnmount() {
    this.componentCleanup();
    window.removeEventListener("beforeunload", this.componentCleanup);
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
    this.state.smartcardBridgeClient.cardreaderDisconnect(
      this.state.selectedCardreader
    );
    this.setState({
      selectedCardreader: e.target.value,
      isSmartcardConnected: false
    });
  }

  onClickConnectDisconnect() {
    if (this.state.isSmartcardConnected) {
      this.state.smartcardBridgeClient
        .cardreaderDisconnect(this.state.selectedCardreader)
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
      this.state.smartcardBridgeClient
        .cardreaderConnect(this.state.selectedCardreader)
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

  getTime() {
    const now = new Date();
    let hour = "" + now.getHours();
    if (hour.length === 1) {
      hour = "0" + hour;
    }
    let minute = "" + now.getMinutes();
    if (minute.length === 1) {
      minute = "0" + minute;
    }
    let second = "" + now.getSeconds();
    if (second.length === 1) {
      second = "0" + second;
    }
    let millisecond = "" + now.getMilliseconds();
    if (millisecond.length === 1) {
      millisecond = "00" + millisecond;
    }
    if (millisecond.length === 2) {
      millisecond = "0" + millisecond;
    }
    return hour + ":" + minute + ":" + second + "." + millisecond;
  }

  cardreaderTransmit(commandAPDU) {
    commandAPDU = commandAPDU.toUpperCase();
    return new Promise((resolve, reject) => {
      const timeCommand = this.getTime();
      const responseAPDULog =
        this.state.responseAPDULog + timeCommand + " << " + commandAPDU + "\n";
      this.setState({
        responseAPDULog
      });
      this.outputResponseAPDULog.scrollTop = this.outputResponseAPDULog.scrollHeight;
      this.state.smartcardBridgeClient
        .cardreaderTransmit(
          this.state.selectedCardreader,
          this.state.protocol,
          commandAPDU
        )
        .then(responseAPDU => {
          const timeResponse = this.getTime();
          const responseAPDULog =
            this.state.responseAPDULog +
            timeResponse +
            " >> " +
            responseAPDU +
            "\n";
          this.setState({
            responseAPDULog
          });
          this.outputResponseAPDULog.scrollTop = this.outputResponseAPDULog.scrollHeight;
          resolve(responseAPDU);
        })
        .catch(error => {
          this.setState({ errorMessage: error });
          reject(error);
        });
    });
  }

  onClickTransmit(e) {
    this.cardreaderTransmit(this.inputCommandAPDU.value);
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
                {this.state.osName === "Windows" ||
                this.state.osName === "MacOS"
                  ? "You must download and install smartcardBridge at first. You may receive security alert because smartcardBridge is not digitally signed."
                  : "Your operating system (" +
                    this.state.osName +
                    ") is not supported."}
              </label>
              <div className="input-group-append">
                <a
                  hidden={
                    this.state.osName !== "Windows" &&
                    this.state.osName !== "MacOS"
                      ? true
                      : false
                  }
                  className="btn btn-danger"
                  href={
                    this.state.osName === "Windows"
                      ? "https://github.com/hosseinpro/smartcardPage/releases/download/v1.1.0/smartcardbridge-1.1.0.Setup.exe"
                      : this.state.osName === "MacOS"
                        ? "https://github.com/hosseinpro/smartcardPage/releases/download/v1.1.0/smartcardbridge-darwin-x64-1.1.0.zip"
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
              ref={el => (this.inputCommandAPDU = el)}
              disabled={!this.state.isSmartcardConnected}
              placeholder="APDU"
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
              className="form-control text-monospace"
              rows="10"
              readOnly
              value={this.state.responseAPDULog}
              ref={el => (this.outputResponseAPDULog = el)}
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
