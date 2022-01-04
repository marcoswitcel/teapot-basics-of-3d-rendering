import Vec3 from "./Vec3.js";
import DepthBuffer from "./depthBuffer.js";

/**
 * @param {Vec3} a 
 * @param {Vec3} b 
 * @param {Vec3} c 
 * @returns 
 */
function cross(a, b, c) {
    return (b.x - a.x) * -(c.y - a.y) - -(b.y - a.y) * (c.x - a.x);
}

/**
 * 
 * @param {ImageData} imageData 
 * @param {DepthBuffer} depthBuffer
 * @param {any} v0 
 * @param {any} v1 
 * @param {any} v2 
 */
export default function fillTriangle(imageData, depthBuffer, v0, v1, v2)
{
    var minX = Math.floor(Math.min(v0.x, v1.x, v2.x));
    var maxX = Math.ceil(Math.max(v0.x, v1.x, v2.x));
    var minY = Math.floor(Math.min(v0.y, v1.y, v2.y));
    var maxY = Math.ceil(Math.max(v0.y, v1.y, v2.y));
  
    var data = imageData.data;
    var width = imageData.width;
  
    // precalculate the area of the parallelogram defined by our triangle
    var area = cross(v0, v1, v2);
  
    // get all properties on our first vertex, for interpolating later
    var props = Object.getOwnPropertyNames(v0);
    
    // p is our 2D pixel location point
    /** @type {Vec3} */
    var p = {};  
    
    // fragment is the resulting pixel with all the vertex attributes interpolated
    var fragment = {};
    
    for (var y = minY; y < maxY; y++) {
        for (var x = minX; x < maxX; x++) {
            // sample from the center of the pixel, not the top-left corner
            p.x = x + 0.5; p.y = y + 0.5;

            // calculate vertex weights
            // should divide these by area, but we do that later
            // so we divide once, not three times
            var w0 = cross(v1, v2, p);
            var w1 = cross(v2, v0, p);
            var w2 = cross(v0, v1, p);
  
            // calculate edges
            var edge0 = { x: v2.x - v1.x, y: v2.y - v1.y };
            var edge1 = { x: v0.x - v2.x, y: v0.y - v2.y };
            var edge2 = { x: v1.x - v0.x, y: v1.y - v0.y };
            
            // calculate which edges are right edges so we can easily skip them
            // right edges go up, or (bottom edges) are horizontal edges that go right
            var edgeRight0 = edge0.y < 0 || (edge0.y == 0 && edge0.x > 0);
            var edgeRight1 = edge1.y < 0 || (edge1.y == 0 && edge0.x > 0);
            var edgeRight2 = edge2.y < 0 || (edge2.y == 0 && edge0.x > 0);

            // if the point is not inside our polygon, skip fragment
            if (w0 < 0 || w1 < 0 || w2 < 0) {
                continue;
            }

                  
            // if this is a right or bottom edge, skip fragment (top-left rule):
            if ((w0 == 0 && edgeRight0) || (w1 == 0 && edgeRight1) || (w2 == 0 && edgeRight2)) {
                continue;
            }

            // interpolate our vertices
            for (var i = 0; i < props.length; i++) {
                var prop = props[i];

                // divide by area here to normalize
                fragment[prop] = (w0 * v0[prop] + w1 * v1[prop] + w2 * v2[prop]) / area;
            }

            // returns true and replaces the value if fragment.z is less than the stored value
            if (typeof fragment.z !== "number" || depthBuffer.testDepth(x, y, fragment.z)) {
                // set pixel
                var index = (y * width + x) * 4;
                data[index] = typeof fragment.r === "number" ? (fragment.r * 256) | 0 : 0;
                data[index + 1] = typeof fragment.g === "number" ? (fragment.g * 256) | 0 : 0;
                data[index + 2] = typeof fragment.b === "number" ? (fragment.b * 256) | 0 : 0;
                data[index + 3] = typeof fragment.a === "number" ? (fragment.a * 256) | 0 : 255;
            }
        }
    }
}