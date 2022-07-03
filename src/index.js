import parseObj from './parseObj.js';
import DepthBuffer from './depthBuffer.js';
import render, { renderWireframe, rotate } from './render.js';
import { getBooleanParam, hasParam, isMobile } from './utils.js';

/**
 * @typedef {import('./Vec3.js').default} Vec3
 */

/** @type {boolean} */
let stopped = hasParam('rotate') ? !getBooleanParam('rotate') : true;

/** @type {boolean} */
let wireframeRender = hasParam('wireframe') ? getBooleanParam('wireframe') : isMobile();

let lastTime = 0;
let deltaTime = 0;
const ANGLES_PER_SECOND = Math.PI / 180 * 20;

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

    /** @type {HTMLCanvasElement} */ //@ts-expect-error
    const canvas = document.getElementById("canvas");

    // Seta o novo tamanho do canvas
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const context = canvas.getContext("2d");
    const depthBuffer = new DepthBuffer(WIDTH, HEIGHT);

    // Pega o objeto do tipo ImageData para permitir manipular os pixels
    const imageData = context.getImageData(0, 0, WIDTH, HEIGHT);
    const uint32View = new Uint32Array(imageData.data.buffer);
    
    /**
     * @param {number} timestamp Quando timestamp é igual a 0 reseta as
     * variáveis de controle pois deve ser o primeiro frame
     * @returns 
     */
    const updateDrawing = function update(timestamp) {
        if (timestamp) {
            if (lastTime) {
                deltaTime = timestamp - lastTime;
                lastTime = timestamp;
            } else {
                deltaTime = 0;
                lastTime = timestamp;
            }
        } else {
            deltaTime = 0;
            lastTime = 0;
        }

        depthBuffer.clear();
        // rgb(100, 149, 237)
        uint32View.fill(0xFFED9564)
    
        if (wireframeRender) {
            console.time('tempo para rasterizar as linhas');
            renderWireframe(model, imageData, {
                // Configurações de renderização em relação a tela
                centerX : WIDTH / 2.0,
                centerY : HEIGHT / 2.0 + 150,
                scale : 100,
            });
            console.timeEnd('tempo para rasterizar as linhas');
        } else {
            console.time('tempo para rasterizar os triângulos');
            render(model, imageData, depthBuffer, {
                // Configurações de renderização em relação a tela
                centerX : WIDTH / 2.0,
                centerY : HEIGHT / 2.0 + 150,
                scale : 100,
                // configurando zFar e zNear clip planes
                zFar  : -3.5,
                zNear : 3.5,
            });
            console.timeEnd('tempo para rasterizar os triângulos');
        }
    
        // transfere o buffer de pixels de volta para o canvas
        context.putImageData(imageData, 0, 0);
        
        if (timestamp) {
            console.time('tempo para rotacionar o bule:');
            const point = { x: 0, y: 0 };
            for (const e of model.verts) {
                point.x = e.x;
                point.y = e.z;
                rotate(point, ANGLES_PER_SECOND * (deltaTime / 1000), 0, 0);
                e.x = point.x;
                e.z = point.y;
            }
            console.timeEnd('tempo para rotacionar o bule:');
        }

        if (stopped) return;
        requestAnimationFrame(update);
    }

    // Força primeiro desenho
    updateDrawing(0);

    /** @type {HTMLInputElement} */ //@ts-expect-error
    const iniciarRotacaoCheck = document.getElementById('iniciarRotacaoCheck');
    // Muda o estado da Flag que controla a rotação e chama a função de desenho de novo
    iniciarRotacaoCheck.addEventListener('change', () => {
        stopped = !iniciarRotacaoCheck.checked;
        if (!stopped) {
            updateDrawing(0);
        }
    });
    iniciarRotacaoCheck.checked = !stopped;

    // Muda o estado da Flag que controla a rotação
    document.getElementById('iniciarTelaCheia').addEventListener('click', () => {
        /** @type {HTMLCanvasElement} */ //@ts-expect-error
        let canvas = document.getElementById("canvas");

        canvas.requestFullscreen();
    });
    
    /** @type {HTMLInputElement} */ //@ts-expect-error
    const inputWireframeCheck = document.getElementById('wireframeCheck');

    // Seta a escuta por mudanças de estado do checkbox
    inputWireframeCheck.addEventListener('change', () => {
        wireframeRender = inputWireframeCheck.checked;

        // Se não estiver animando, força um novo `render`
        if (stopped) {
            updateDrawing(0);
        }
    });

    // Seta o estado inicial da sessão
    inputWireframeCheck.checked = wireframeRender;
}

// Configuramos nosso programa para executar após o documento carregar
window.addEventListener('load', loadAndStartModel);
