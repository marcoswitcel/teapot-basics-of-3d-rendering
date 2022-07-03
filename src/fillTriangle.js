import Vec3 from "./Vec3.js";
import DepthBuffer from "./depthBuffer.js";

/**
 * @typedef {{
 *    x: number, y: number, z: number,
 *    r: number, g: number, b: number
 * }} VertexFragment
 */

/**
 * @param {Vec3} a 
 * @param {Vec3} b 
 * @param {Vec3} c 
 * @returns {number}
 */
function cross(a, b, c) {
    return (b.x - a.x) * -(c.y - a.y) - -(b.y - a.y) * (c.x - a.x);
}

/**
 * 
 * @param {ImageData} imageData 
 * @param {DepthBuffer} depthBuffer
 * @param {VertexFragment} v0 
 * @param {VertexFragment} v1 
 * @param {VertexFragment} v2 
 */
export default function fillTriangle(imageData, depthBuffer, v0, v1, v2)
{
    const minX = Math.floor(Math.min(v0.x, v1.x, v2.x));
    const maxX = Math.ceil(Math.max(v0.x, v1.x, v2.x));
    const minY = Math.floor(Math.min(v0.y, v1.y, v2.y));
    const maxY = Math.ceil(Math.max(v0.y, v1.y, v2.y));
  
    const data = imageData.data;
    const width = imageData.width;
  
    // calcula a área do paralelogramo definido pelo nosso triângulo
    const area = cross(v0, v1, v2);
    
    // p contém a localização do nosso pixel no plano 2D
    /** @type {Vec3} */
    const p = {};  
    
    // fragment é o pixel resultante com todos os atributos da vertex interpolados
    /** @type {VertexFragment} */
    const fragment = {};
    
    for (let y = minY; y < maxY; y++) {
        for (let x = minX; x < maxX; x++) {
            // vamos extrair a cor do centro do pixel, não do topo-esquerdo
            p.x = x + 0.5;
            p.y = y + 0.5;

            // calcula o peso das vertex
            // deveríamos dividir pela área, mas fazemos isso depois
            // para dividir apenas uma vez e não três
            const w0 = cross(v1, v2, p);
            const w1 = cross(v2, v0, p);
            const w2 = cross(v0, v1, p);
  
            // calculamos as extremidades
            const edge0 = { x: v2.x - v1.x, y: v2.y - v1.y };
            const edge1 = { x: v0.x - v2.x, y: v0.y - v2.y };
            const edge2 = { x: v1.x - v0.x, y: v1.y - v0.y };
            
            // calculate which edges are right edges so we can easily skip them
            // right edges go up, or (bottom edges) are horizontal edges that go right
            const edgeRight0 = edge0.y < 0 || (edge0.y == 0 && edge0.x > 0);
            const edgeRight1 = edge1.y < 0 || (edge1.y == 0 && edge0.x > 0);
            const edgeRight2 = edge2.y < 0 || (edge2.y == 0 && edge0.x > 0);

            // if the point is not inside our polygon, skip fragment
            if (w0 < 0 || w1 < 0 || w2 < 0) {
                continue;
            }

                  
            // if this is a right or bottom edge, skip fragment (top-left rule):
            if ((w0 == 0 && edgeRight0) || (w1 == 0 && edgeRight1) || (w2 == 0 && edgeRight2)) {
                continue;
            }
            
            // Interpolando propriedades das vértices (loop substituído para aumentar perfomance)
            // Divide pelo valor da área pra normalizar
            fragment.r = (w0 * v0.r + w1 * v1.r + w2 * v2.r) / area;
            fragment.g = (w0 * v0.g + w1 * v1.g + w2 * v2.g) / area;
            fragment.b = (w0 * v0.b + w1 * v1.b + w2 * v2.b) / area;
            fragment.z = (w0 * v0.z + w1 * v1.z + w2 * v2.z) / area;
            fragment.x = (w0 * v0.x + w1 * v1.x + w2 * v2.x) / area;
            fragment.y = (w0 * v0.y + w1 * v1.y + w2 * v2.y) / area;

            // Substitui o pixel se o atributo z for menor que o valor de z no deapthBuffer
            if (depthBuffer.testDepth(x, y, fragment.z)) {
                // cálcula o índice do píxel
                const index = (y * width + x) * 4;
                data[index] = (fragment.r * 256) | 0;
                data[index + 1] = (fragment.g * 256) | 0;
                data[index + 2] = (fragment.b * 256) | 0;
                data[index + 3] = 255;
            }
        }
    }
}
