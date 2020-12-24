/**
 * Author: Gery Casiez
 *
 */

window.gvar = {};
var gvar = window.gvar;

document.addEventListener("DOMContentLoaded", function() {

  var socket;
  var msg = document.getElementById('msg');
  var lasers = [];
  lasers.push(new Audio('laser1.mp3'));
  lasers.push(new Audio('laser2.mp3'));
  lasers.push(new Audio('laser3.mp3'));
  lasers.push(new Audio('laser4.mp3'));
  var explosion = new Audio('explosion1.mp3');
  var prevsound = -1;

  loadjscssfile("socket.io/socket.io.js", "js"); 
  //loadjscssfile(window.location.origin + "/socket.io/socket.io.js", "js");

  whenAvailable(["io"], function() {
    // Server communication
    //socket = io({query: window.location.search.substr(1), path: "/pointevo/socket.io"});
    socket = io({query: window.location.search.substr(1)});


    socket.on('connected', function (data) {
      console.log("connected");
    });

    socket.on('deviceConnected', function (data) {
      console.log("deviceConnected");
      msg.innerText = "Leonardo connectée";
    });

    socket.on('deviceDisconnected', function (data) {
      console.log("deviceDisconnected");
      msg.innerText = "Leonardo déconnectée";
    });

    socket.on('buttonPressed', function (data) {
      var newsound = Math.floor(Math.random() * 3);
      while (newsound == prevsound) {
        newsound = Math.floor(Math.random() * 3);
      }
      prevsound = newsound;
      lasers[newsound].play();
      if (Math.random() < 0.3) {
        explosion.play();
      }
    });
  });

  function loadjscssfile(filename, filetype){
      //console.log(filename + " loaded");
      if (filetype == "js") {
          var fileref = document.createElement('script')
          fileref.setAttribute("type","text/javascript")
          fileref.setAttribute("src", filename)
      } else if (filetype == "css") {
          var fileref = document.createElement("link")
          fileref.setAttribute("rel", "stylesheet")
          fileref.setAttribute("type", "text/css")
          fileref.setAttribute("href", filename)
      }
      if (typeof fileref != "undefined") {
          document.getElementsByTagName("head")[0].appendChild(fileref);
      }
  }

  function whenAvailable(names, callback) {
      var interval = 10; // ms
      window.setTimeout(function() {
          var all_loaded = true;
          for (var k = 0; k < names.length; k++) {
              if (!window[names[k]]) {
                  all_loaded = false;
              }
          }
          if (all_loaded) {
              callback();
          } else {
              window.setTimeout(arguments.callee, interval);
          }
      }, interval);
  }  

});
