import axios from "axios";

class SmartcardBridgeClient {
  smartcardBridgeAddress = "";

  constructor(smartcardBridgeAddress) {
    this.smartcardBridgeAddress = smartcardBridgeAddress;
  }

  getVersion() {
    return new Promise((resolve, reject) => {
      axios
        .get(this.smartcardBridgeAddress)
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  listCardreaders() {
    return new Promise((resolve, reject) => {
      axios
        .post(this.smartcardBridgeAddress + "/api/listreaders")
        .then(res => {
          resolve(res.data.cardreaderList);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  }

  cardreaderConnect(selectedCardreader) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.smartcardBridgeAddress + "/api/connect", {
          name: selectedCardreader
        })
        .then(res => {
          if (res.data.result === "Error") {
            reject(res.data.message);
          } else {
            resolve({
              protocol: res.data.protocol
            });
          }
        })
        .catch(error => {
          reject(error.message);
        });
    });
  }

  cardreaderDisconnect(selectedCardreader) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.smartcardBridgeAddress + "/api/disconnect", {
          name: selectedCardreader
        })
        .then(res => {
          if (res.data.result === "Error") {
            reject(res.data.message);
          } else {
            resolve();
          }
        })
        .catch(error => {
          reject(error.message);
        });
    });
  }

  cardreaderTransmit(selectedCardreader, protocol, commandAPDU) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.smartcardBridgeAddress + "/api/transmit", {
          name: selectedCardreader,
          protocol: protocol,
          commandAPDU: commandAPDU.toUpperCase()
        })
        .then(res => {
          resolve(res.data.responseAPDU.toUpperCase());
        })
        .catch(error => {
          reject(error.message);
        });
    });
  }
}

export default SmartcardBridgeClient;
