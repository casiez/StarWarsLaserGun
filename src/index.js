/*
   Gery Casiez
   Dec 2020
*/

const express = require('express')
const app = express()
const port = 3000
const path = require('path')

var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/'));


const sound = require('sound-play');

var HID = require('node-hid');
var hid;

var deviceConnected = false;
var deviceConnectedPrev = false;



function waitForDevice(socket) {
  var devices = HID.devices();
  var foundLeonardo = devices.find( function(d) {
      return d.vendorId===0x2341 && d.productId===0x8036;
  });
  if (foundLeonardo) {
    console.log('Found Leonardo')
    if (!deviceConnected) {
      hid = new HID.HID(0x2341, 0x8036);
    }
    deviceConnected = true;
    socket.emit('deviceConnected');

    hid.gotData = function (err, data) {
        console.log('got data', data);
        if (data != undefined) {
          socket.emit('buttonPressed');

          this.read(this.gotData.bind(this));
        } else {
          hid.close();
          deviceConnected = false;
          setTimeout(waitForDevice, 100, socket);
        }
    };

    hid.read(hid.gotData.bind(hid));
  } else {
    socket.emit('deviceDisconnected');
    setTimeout(waitForDevice, 100, socket);
  }

}

function callback (socket) {
  console.log('connection');
  socket.emit('connected');
  if (deviceConnected) {
    socket.emit('deviceConnected');
  } else {
    socket.emit('deviceDisconnected');
  }

  waitForDevice(socket);
  /*setTimeout(waitForDevice, 100, socket);

  setInterval(() => {
    if (!deviceConnectedPrev && deviceConnected) {
      console.log('=> deviceConnected');
      socket.emit('deviceConnected');
    }
    if (deviceConnectedPrev && !deviceConnected) {
      console.log('=> deviceDisConnected');
      socket.emit('deviceDisconnected');
    }    
    deviceConnectedPrev = deviceConnected;
  }, 100);*/

}

io.on('connection', callback);

/*
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
  console.log('hello world');

})*/

server.listen(port);
console.log('Server listening on port '+port+'.');


