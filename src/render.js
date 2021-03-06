import DepthBuffer from './depthBuffer.js';
import drawLine from './drawLine.js';
import fillTriangle from './fillTriangle.js';

/**
 * @typedef {import('./Vec3.js').default} Vec3
 */

export function crossProduct(a, b) {
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x
    };
}

export function  rotate(point, angle, cx, cy) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    
    // faz a translação do ponto de volta a origem
    point.x -= cx;
    point.y -= cy;
    
    // rotaciona os pontos
    const xnew = point.x * c - point.y * s;
    const ynew = point.x * s + point.y * c;
    
    // desfaz a translação do ponto de volta a origem
    point.x = xnew + cx;
    point.y = ynew + cy;
}

/**
 * 
 * @param {*} context 
 * @param {string} color 
 * @param {*} width 
 * @param {*} height 
 */
export function clear(context, color, width, height) {
    context.fillStyle = color;
    context.fillRect(0, 0, width, height);
}

// Retorna `true` se as vértices estão no sentido anti-horário
export function isCcw(v0, v1, v2) {
    return (v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x) >= 0;
}

/**
 * 
 * @param {{ verts: Vec3[], faces: number[][] }} model 
 * @param {ImageData} imageData 
 * @param {DepthBuffer} depthBuffer 
 */
export default function render(model, imageData, depthBuffer, {
    centerX, centerY, scale, zNear, zFar
}) {
    // Renderiza o nosso modelo
    for (let i = 0; i < model.faces.length; i++) {
        const face = model.faces[i];
        const v0 = model.verts[face[0] - 1];
        const v1 = model.verts[face[1] - 1];
        const v2 = model.verts[face[2] - 1];
        
        if (v0 && v1 && v2) {
            if (isCcw(v0, v1, v2)) {
                // Cria alguns valores de tons de cinza a partir do valor do eixo Z do modelo
                const v0value = v0.z / 4.5 + 0.5;
                const v1value = v1.z / 4.5 + 0.5;
                const v2value = v2.z / 4.5 + 0.5;
                    
                fillTriangle(
                    imageData,
                    depthBuffer,
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
}

/**
 * 
 * @param {{ verts: Vec3[], faces: number[][] }} model 
 * @param {ImageData} imageData 
 */
export function renderWireframe(model, imageData, {
    centerX, centerY, scale
}) {
    // Renderiza o nosso modelo
    for (let i = 0; i < model.faces.length; i++) {
        const face = model.faces[i];
        const v0 = model.verts[face[0] - 1];
        const v1 = model.verts[face[1] - 1];
        const v2 = model.verts[face[2] - 1];
        
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
}
