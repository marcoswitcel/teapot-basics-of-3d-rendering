//@ts-check
import parseObj from './parseObj.js';
import DepthBuffer from './depthBuffer.js';
import render, { clear, rotate } from './render.js';

// add all properties on the IO object to the window object
// so they can be used without prefixing "IO."

// main function called on load
async function run() {

    const rawContent = await fetch('teapot.obj')
        .then((response) => response.text());

    // parse our teapot obj model file
    console.time('tempo de parse');
    let model = parseObj(rawContent);
    console.timeEnd('tempo de parse');
    // start main program
    start(model);

    //@ts-expect-error
    window.doItAgain = () => start(model);
    //@ts-expect-error
    window.model = model;
    //@ts-expect-error
    window.rotate = rotate;
}



function start(model) {
    const WIDTH = 800;
    const HEIGHT = 480;

    // set our canvas size
    let canvas = document.getElementById("canvas");

    //@ts-expect-error
    canvas.width = WIDTH;
    //@ts-expect-error
    canvas.height = HEIGHT;
    
    // create depth buffer
    // use Uint16 because we only need a little precision and we save 2 bytes per pixel this way
    const depthBuffer = new DepthBuffer(WIDTH, HEIGHT);
    // clear depth buffer and attach to imageData
    depthBuffer.clear();
    
    // clear our canvas to opaque black
    //@ts-expect-error
    var context = canvas.getContext("2d");
    clear(context, "rgb(100, 149, 237)", WIDTH, HEIGHT);

    // get image data for direct pixel access
    var imageData = context.getImageData(0, 0, WIDTH, HEIGHT);

    render(model, imageData, depthBuffer, {
        // some drawing positioning
        centerX : WIDTH / 2.0,
        centerY : HEIGHT / 2.0 + 150,
        scale : 100,
        // create our zFar and zNear clip planes
        zFar  : -2.5,
        zNear : 2.5,
    });

    // write our new pixels to the canvas
    context.putImageData(imageData, 0, 0);
}

// run our program when the document's loaded
document.body.onload = run;