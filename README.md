# smartcardPage

smartcardPage is a demo page to demonstrate how to use smartcardBridge.
You can send APDU command and receive APDU response to/from all ISO7816/14443 and NFC smart card with this utility.

## Online Demo

You can see online demo version of smartcardPage and smartcardBridge at: https://hosseinpro.github.io/smartcardPage/

## Download Binary

You may download smartcardBridge setup file here:

- [x] Windows (x64) [smartcardbridge-1.0.0 Setup.exe](https://github.com/hosseinpro/smartcardPage/raw/master/smartcardBridge/out/make/squirrel.windows/x64/smartcardbridge-1.0.0%20Setup.exe)
- [ ] Windows (x86)
- [ ] MacOS

## Description

smartcardPage uses smartcardBridge and calls its HTTP services. To do that, smartcardPage includes a specific JavaScript library `smartcardBridgeClient.js` which implements all required calls and catches. If you would like to use smartcardBridge at your own web page, you just need this library. Although, you may develop your own library and call smartcardBridge services directly.

These are `smartcardBridgeClient.js` functions. These functions implemented as Promise and you can find usage sample codes in smartcardPage source code.

- `getVersion` : Connects to smartcardBridge and returns its version. You may use this function to check if smartcardBridge is installed.
- `listCardreaders` : Returns a list of all smartcard readers which are connected to the client.
- `cardreaderConnect` : Connects to a smartcard inserted in a smartcard reader.
- `cardreaderDisconnect` : Disconnects from a smartcard.
- `cardreaderTransmit` : Sends a smartcard command (APDU) to a smartcard and receives its response.

## Compile and Run

smartcardPage is developed using [ReactJS](https://reactjs.org) and [Bootstrap 4](https://getbootstrap.com). It also uses [Axios](https://github.com/axios) as HTTP client library to call smartcardBridge HTTP services. Actually, smartcardBridge and smartcardPage are two separate independent projects which you may download each one and compile it independently.

To compile smartcardPage, you must install NPM or another package manager, and run these commands:

1.  Download smartcardPage's source code with:

```
    git clone https://github.com/hosseinpro/smartcardBridge/tree/master/smartcardPage
```

2.  Go to smartcardPage folder and install required node modules with:

```
    npm install (or equivalent command in yarn or other package managers)
```

3.  Run development server to display smartcardPage:

```
    npm start
```

## Change of address

smartcardBridge serves at http://localhost:3333 by default. If you change that, you can update the service address for smartcardPage at /src/App.js in 'smartcardBridgeAddress' properties of MainPage component.