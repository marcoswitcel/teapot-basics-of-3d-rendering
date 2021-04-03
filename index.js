//@ts-check
import drawLine from './drawline.js';
import parseObj from './parseObj.js';
import fillTriangle from './fillTriangle.js';

// add all properties on the IO object to the window object
// so they can be used without prefixing "IO."
usingModule(IO);
var model = null;
var canvas;


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

function clear(context, color) {
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

// returns true if vertices are in counterclockwise order
function isCcw(v0, v1, v2) {
    return (v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x) >= 0;
}

function start() {
    // set our canvas size
    canvas = document.getElementById("canvas");
    canvas.width = 800;
    canvas.height = 480;
    
    // create our zFar and zNear clip planes
    var zFar = -2.5;
    var zNear = 2.5; 
    
    // create depth buffer
    // use Uint16 because we only need a little precision and we save 2 bytes per pixel this way
    window.depthBuffer = new Uint16Array(canvas.width * canvas.height);

    // clear our canvas to opaque black
    var context = canvas.getContext("2d");
    // context.fillStyle = "black";
    // context.fillRect(0, 0, canvas.width, canvas.height);
    clear(context, "rgb(100, 149, 237)");

    // get image data for direct pixel access
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // add some properties and methods to make using this easier
    depthBuffer.width = canvas.width;
    depthBuffer.height = canvas.height;
    depthBuffer.clear = function() { this.fill(65535); };
    depthBuffer.getDepth = function(x, y) { return this[y * this.width + x] / 65535.0; };
    depthBuffer.setDepth = function(x, y, v) { this[y * this.width + x] = (v * 65535) | 0; };
    depthBuffer.testDepth = function(x, y, v) {
        var value = (v * 65535) | 0;
        if (value < 0 || value > 65535) {
        return false;
        }
        var index = y * this.width + x;
        if (value < this[index]) {
        this[index] = value;
        return true;
        }
        return false;
    };
    
    // clear depth buffer and attach to imageData
    depthBuffer.clear();
    imageData.depthBuffer = depthBuffer;

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
                // create some greyscale values from the model's Z values
                var v0value = v0.z / 4.5 + 0.5;
                var v1value = v1.z / 4.5 + 0.5;
                var v2value = v2.z / 4.5 + 0.5;
                    
                // drawLine(imageData, centerX + v0.x * scale, centerY - v0.y * scale, centerX + v1.x * scale, centerY - v1.y * scale);
                // drawLine(imageData, centerX + v1.x * scale, centerY - v1.y * scale, centerX + v2.x * scale, centerY - v2.y * scale);
                // drawLine(imageData, centerX + v2.x * scale, centerY - v2.y * scale, centerX + v0.x * scale, centerY - v0.y * scale);
                fillTriangle(
                    imageData,
                    { x: centerX + v0.x * scale, y: centerY - v0.y * scale, z: (v0.z - zNear) / (zFar - zNear),
                      r: v0value, g: v0value, b: v0value },
                    { x: centerX + v1.x * scale, y: centerY - v1.y * scale, z: (v1.z - zNear) / (zFar - zNear),
                      r: v1value, g: v1value, b: v1value },
                    { x: centerX + v2.x * scale, y: centerY - v2.y * scale, z: (v2.z - zNear) / (zFar - zNear),
                      r: v2value, g: v2value, b: v2value }
                );
            }
        }
        else {
            if (!v0) { console.log("Vertice " + (face[0] - 1) + " not found!"); }
            if (!v1) { console.log("Vertice " + (face[1] - 1) + " not found!"); }
            if (!v2) { console.log("Vertice " + (face[2] - 1) + " not found!"); }
        }
    }
    // fillTriangle(
    //     imageData,
    //     { x: 200.5, y: 400.5, z: 0, r: 1.0, g: 0.0, b: 0.0 },
    //     { x: 250.5, y: 150.5, z: 0, r: 0.0, g: 1.0, b: 0.0 },
    //     { x: 90.5, y: 250.5, z: 0, r: 0.0, g: 0.0, b: 1.0 }
    // );
    // fillTriangle(
    //     imageData,
    //     { x: 10, y: 10, z: 0, r: 0.3, g: 0.3, b: 0.3 },
    //     { x: 10, y: 110, z: 0, r: 0.3, g: 0.3, b: 0.3 },
    //     { x: 110, y: 10, z: 0, r: 0.3, g: 0.3, b: 0.3 }
    // );
    // fillTriangle(
    //     imageData,
    //     { x: 110, y: 10, z: 0, r: 0.3, g: 0.3, b: 0.3 },
    //     { x: 10, y: 110, z: 0, r: 0.3, g: 0.3, b: 0.3 },
    //     { x: 110, y: 110, z: 0, r: 0.3, g: 0.3, b: 0.3 }
    // );
    console.timeEnd('tempo para rasterizar as linhas');

    // write our new pixels to the canvas
    context.putImageData(imageData, 0, 0);
}

// turn on debug mode so errors throw up an alert
// containing error information and stack trace
debugMode(true);

// run our program when the document's loaded
document.body.onload = run;