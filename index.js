//@ts-check
import parseObj from './parseObj.js';
import DepthBuffer from './depthBuffer.js';
import render, { clear, rotate } from './render.js';

// Carrega 
async function loadAndStartModel() {

    const rawContent = await fetch('teapot.obj')
        .then((response) => response.text());

    // parse our teapot obj model file
    console.time('tempo de parse');
    let model = parseObj(rawContent);
    console.timeEnd('tempo de parse');
    
    // Inicia o render
    start(model);
}



function start(model) {
    const WIDTH = 800;
    const HEIGHT = 480;

    // set our canvas size
    /** @type {HTMLCanvasElement} @ts-expect-error*/
    //@ts-expect-error
    let canvas = document.getElementById("canvas");

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    // clear our canvas to opaque black

    var context = canvas.getContext("2d");
    
    // create depth buffer
    // use Uint16 because we only need a little precision and we save 2 bytes per pixel this way
    const depthBuffer = new DepthBuffer(WIDTH, HEIGHT);
    // clear depth buffer and attach to imageData
    
    requestAnimationFrame(function update() {
        depthBuffer.clear();
        clear(context, "rgb(100, 149, 237)", WIDTH, HEIGHT);
    
        // get image data for direct pixel access
        var imageData = context.getImageData(0, 0, WIDTH, HEIGHT);
    
        render(model, imageData, depthBuffer, {
            // some drawing positioning
            centerX : WIDTH / 2.0,
            centerY : HEIGHT / 2.0 + 150,
            scale : 100,
            // create our zFar and zNear clip planes
            zFar  : -3.5,
            zNear : 3.5,
        });
    
        // write our new pixels to the canvas
        context.putImageData(imageData, 0, 0);
        
        return;
        
        console.time('tempo para rotacionar o bule:');
        model.verts.map(e => {
            const point = {x: e.x, y: e.z};
            rotate(point, Math.PI / 180 * 1, 0,0);
            e.x = point.x;
            e.z = point.y;
            return  e;
        })
        console.timeEnd('tempo para rotacionar o bule:');

        requestAnimationFrame(update);
    });
}

// run our program when the document's loaded
window.addEventListener('load', loadAndStartModel);