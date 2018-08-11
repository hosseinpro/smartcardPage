# smartcardBridge

This is a tool which provides local operating system smartcard API (PC/SC) as HTTP services. smartcardBridge supports all PC/SC and CCID smartcard readers (almost all readers in the market). It also supports [jCardSim](https://github.com/licel/jcardsim) as java card simulator with a simple REST server.
You may use smartcardBridge to share smart card between different virtual machines (VM) and to share a smart card on a network.

## Online Demo

You can see online demo version of smartcardPage and smartcardBridge at: https://hosseinpro.github.io/smartcardPage/

## Download Binary

You may download smartcardBridge setup file for Windows and MacOS [here](https://github.com/hosseinpro/smartcardPage/releases)

**Note**
When you install smartcardBridge setup, it starts automatically in the operating system's restart.

## Description

smartcardBridge is a desktop application and implemented in [Node](https://nodejs.org/) and [Electron](https://electronjs.org/). It is released as a standalone setup file for Windows using [Electron Forge](https://github.com/electron-userland/electron-forge). smartcardBridge supports Windows (x86/x64), MacOS and Linux potentially, but I just compiled that for Windows and MacOS.

smartcardBridge uses [Express](https://expressjs.com/) to provide HTTP services to web pages. It utilizes [node-pcsclite](https://github.com/santigimeno/node-pcsclite) to connects to operating system's PC/SC API.

You may use `smartcardBridgeClient.js` Java Script library functions (at smartcardPage project) to consume smartcardBridge HTTP API. You may also use smartcardBridge HTTP services directly.

- `http://localhost:3333/` : Returns smartcardBridge's version. You may use this function to check if smartcardBridge is installed.
- `http://localhost:3333/api/listreader` : Returns a list of all smartcard readers which are connected to the client.
- `http://localhost:3333/api/connect` : Connects to a smartcard inserted in a smartcard reader.
- `http://localhost:3333/api/disconnect` : Disconnects from a smartcard.
- `http://localhost:3333/api/transmit` : Sends a smartcard command (APDU) to a smartcard and receives its response.

smartcardBridge serves at http://localhost:3333 by default, but you can change it at `server.js`.

## Compile and Run

Actually, smartcardBridge and smartcardPage are two separate independent projects which you may download each one and compile it independently. To compile smartcardBridge, you must install NPM or another package manager, and run these commands:

1.  Download smartcardBridge's source code with:

```
    git clone https://github.com/hosseinpro/smartcardPage/tree/master/smartcardBridge
```

2.  Go to smartcardBridge folder and install required node modules with:

```
    npm install (or equivalent command in yarn or other package managers)
```

3.  Run electron-forge to start smartcardBridge's server:

```
    electron-forge start
```

4.  (Optionally) Compile smartcardBridge and make a setup file for current platform with electron-forge:

```
    electron-forge make
```

**Note**
smartcardBridge uses Node Native Modules and must compile for each target platform (Windows, MacOS and Linux) at the same development platform. So, if you would like to make setup for Windows platform, you must compile smartcardBridge in Windows platform. You may need additional native development packages such as C++ Redistributable package for each platform, and Python.
