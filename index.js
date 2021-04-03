//@ts-check
import drawLine from './drawline.js';
import parseObj from './parseObj.js';

// add all properties on the IO object to the window object
// so they can be used without prefixing "IO."
usingModule(IO);
var model = null;

// main function called on load
function run() {
  // loads list of files asynchronously, calls function when done
  File.loadFiles(
    function(files) {
      // parse our teapot obj model file
      model = parseObj(files[0].value);
      // start main program
      start();
    },
    "teapot.obj"
  );
}

function crossProduct(a, b) {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x
    };
}

// returns true if vertices are in counterclockwise order
function isCcw(v0, v1, v2) {
    return (v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x) >= 0;
}

function start() {
  // set our canvas size
  var canvas = document.getElementById("canvas");
  canvas.width = 800;
  canvas.height = 480;
  
  // clear our canvas to opaque black
  var context = canvas.getContext("2d");
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // get image data for direct pixel access
  var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // some drawing positioning
    var centerX = canvas.width / 2.0;
    var centerY = canvas.height / 2.0;  
    var scale = 100;
    centerY += 150;
    
    console.time('tempo para rasterizar as linhas');
    // draw our model
    for (var i = 0; i < model.faces.length; i++) {
      var face = model.faces[i];
      var v0 = model.verts[face[0] - 1];
      var v1 = model.verts[face[1] - 1];
      var v2 = model.verts[face[2] - 1];
      
      if (v0 && v1 && v2) {
        if (isCcw(v0, v1, v2)) {
            drawLine(imageData, centerX + v0.x * scale, centerY - v0.y * scale, centerX + v1.x * scale, centerY - v1.y * scale);
            drawLine(imageData, centerX + v1.x * scale, centerY - v1.y * scale, centerX + v2.x * scale, centerY - v2.y * scale);
            drawLine(imageData, centerX + v2.x * scale, centerY - v2.y * scale, centerX + v0.x * scale, centerY - v0.y * scale);
        }
      }
      else {
        if (!v0) { console.log("Vertice " + (face[0] - 1) + " not found!"); }
        if (!v1) { console.log("Vertice " + (face[1] - 1) + " not found!"); }
        if (!v2) { console.log("Vertice " + (face[2] - 1) + " not found!"); }
      }
    }
    console.timeEnd('tempo para rasterizar as linhas');
    
    // write our new pixels to the canvas
    context.putImageData(imageData, 0, 0);
}

// turn on debug mode so errors throw up an alert
// containing error information and stack trace
debugMode(true);

// run our program when the document's loaded
document.body.onload = run;