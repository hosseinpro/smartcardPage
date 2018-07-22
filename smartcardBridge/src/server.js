/////////////Installer section begin
const {app} = require('electron')

var handleStartupEvent = function() {
  var squirrelCommand = process.argv[1];
  switch (squirrelCommand) {
      case '--squirrel-install':
      case '--squirrel-updated':
        app.setLoginItemSettings({
          openAtLogin: true
        })
        app.quit();
        return true;
      case '--squirrel-uninstall':
      case '--squirrel-obsolete':
        app.setLoginItemSettings({
          openAtLogin: false
        })
        app.quit();
        return true;
  }
};

if (handleStartupEvent()) {
  app.quit();
}
/////////////Installer section end

/////////////Application section begin
const port = 3333;
const cardResponseBufferSize = 10000;

const express = require('express');
const expressApp = express();
expressApp.use(express.json());
const cors = require('cors');
expressApp.use(cors());
const pcsclite = require('pcsclite');
const pcsc = pcsclite();

expressApp.get('/', (req, res) => {
    res.send(JSON.stringify({name: app.getName(), version: app.getVersion()}));
});

expressApp.post('/api/listreaders', (req, res) => {
   res.send(pcsc.readers);
});

expressApp.post('/api/connect', (req, res) => {
    const reader = pcsc.readers[req.body.name];
    if(!reader) {
        res.send(JSON.stringify({result: 'Error', message: 'Reader not found'}));
        return;
    }
    if(reader.connected) {
        res.send(JSON.stringify({result: 'Connected', message: 'Already connected'}));
        return;
    }
    reader.connect((error, protocol) => {
        if(error)
            res.send(JSON.stringify({result: 'Error', message: error.message}));
        else {
            res.send(JSON.stringify({result: 'Connected', protocol: protocol}));
        }
    });
});

expressApp.post('/api/disconnect', (req, res) => {
    const reader = pcsc.readers[req.body.name];
    if(!reader) {
        res.send(JSON.stringify({result: 'Error', message: 'Reader not found'}));
        return;
    }
    if(reader.connected === false) {
        res.send(JSON.stringify({result: 'Disconnected', message: 'Already disconnected'}));
        return;
    }
    reader.disconnect((error) => {
        if(error)
            res.send(JSON.stringify({result: 'Error', message: error.message}));
        else{
            res.send(JSON.stringify({result: 'Disconnected'}));
        }
    });
});

expressApp.post('/api/transmit', (req, res) => {
    const reader = pcsc.readers[req.body.name];
    if(!reader) {
        res.send(JSON.stringify({result: 'Error', message: 'Reader not found'}));
        return;
    }
    if(!reader.connected) {
        res.send(JSON.stringify({result: 'Error', message: 'Card not found'}));
        return;
    }
    let inBuffer = Buffer.from(req.body.commandAPDU.replace(/\s/g, ''), 'hex');
    reader.transmit(inBuffer, cardResponseBufferSize, req.body.protocol, (error, outBuffer) => {
        if(error)
            res.send(JSON.stringify({result: 'Error', message: error.message}));
        else
            res.send(JSON.stringify({result: 'Transmitted', responseAPDU: outBuffer.toString('hex')}));
    });
});

expressApp.listen(port, () => console.log(app.getName() + ' ' + app.getVersion() + ' is listening on port ' + port + '...'));
/////////////Application section end