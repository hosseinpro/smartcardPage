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
          <div className="row mt-2">
            <label
              className={
                this.state.isSmartcardBridgeAvailable
                  ? "text-auto"
                  : "text-danger"
              }
            >
              {this.state.isSmartcardBridgeAvailable
                ? "smartcardBridge is connected"
                : "smartcardBridge is not connected"}
            </label>
          </div>
          <div className="row mt-2 input-group">
            <select
              className="custom-select"
              onChange={this.onChangeCardreaderList.bind(this)}
            >
              {this.state.cardreaderList.map(readername => {
                return <option key={readername}>{readername}</option>;
              })}
            </select>
            <div className="input-group-append">
              <button
                className="btn btn-primary"
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
