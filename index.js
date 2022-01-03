import parseObj from './parseObj.js';
import DepthBuffer from './depthBuffer.js';
import render, { clear, rotate } from './render.js';

/**
 * @typedef {import('./Vec3.js').default} Vec3
 */

let stopped = true;

// Carrega 
async function loadAndStartModel() {
    const response = await fetch('teapot.obj')
    const rawContent = await response.text();

    // parseia nosso arquivo de modelo .obj
    console.time('tempo de parse');
    let model = parseObj(rawContent);
    console.timeEnd('tempo de parse');
    
    // Inicia o render
    start(model);
}

/**
 * @param {{ verts: Vec3[], faces: number[][] }} model 
 */
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
    
    const updateDrawing = function update() {
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
        
        
        console.time('tempo para rotacionar o bule:');
        model.verts.map(e => {
            const point = {x: e.x, y: e.z};
            rotate(point, Math.PI / 180 * 1, 0,0);
            e.x = point.x;
            e.z = point.y;
            return  e;
        })
        console.timeEnd('tempo para rotacionar o bule:');

        if (stopped) return;
        requestAnimationFrame(update);
    }

    // Força primeiro desenho
    updateDrawing();

    // Muda o estado da Flag que controla a rotação e chama a função de desenho de novo
    document.getElementById('iniciarRotacao').addEventListener('click', () => {
        if (stopped) {
            stopped = !stopped;
            updateDrawing();
        } else {
            stopped = !stopped;
        }
    });

    // Muda o estado da Flag que controla a rotação
    document.getElementById('iniciarTelaCheia').addEventListener('click', () => {
        /** @type {HTMLCanvasElement} @ts-expect-error*/
        //@ts-expect-error
        let canvas = document.getElementById("canvas");

        canvas.requestFullscreen();
    });
}

// run our program when the document's loaded
window.addEventListener('load', loadAndStartModel);
