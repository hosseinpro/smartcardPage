import axios from "axios";

var getVersion = function(smartcardBridgeAddress) {
  return new Promise(function(resolve, reject) {
    axios
      .get(smartcardBridgeAddress)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
};

var listCardreaders = function(smartcardBridgeAddress) {
  return new Promise(function(resolve, reject) {
    axios
      .post(smartcardBridgeAddress + "/api/listreaders")
      .then(res => {
        const cardreaderList = [];
        cardreaderList[0] = Object.keys(res.data)[0];
        cardreaderList[1] = Object.keys(res.data)[1];
        resolve(cardreaderList);
      })
      .catch(error => {
        reject(error.message);
      });
  });
};

var cardreaderConnect = function(smartcardBridgeAddress, selectedCardreader) {
  return new Promise(function(resolve, reject) {
    axios
      .post(smartcardBridgeAddress + "/api/connect", {
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
};

var cardreaderDisconnect = function(
  smartcardBridgeAddress,
  selectedCardreader
) {
  return new Promise(function(resolve, reject) {
    axios
      .post(smartcardBridgeAddress + "/api/disconnect", {
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
};

var cardreaderTransmit = function(
  smartcardBridgeAddress,
  selectedCardreader,
  protocol,
  commandAPDU
) {
  return new Promise(function(resolve, reject) {
    axios
      .post(smartcardBridgeAddress + "/api/transmit", {
        name: selectedCardreader,
        protocol: protocol,
        commandAPDU: commandAPDU
      })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error.message);
      });
  });
};

export {
  getVersion,
  listCardreaders,
  cardreaderConnect,
  cardreaderDisconnect,
  cardreaderTransmit
};
