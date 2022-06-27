
/**
 * Desenha uma linha usando o algorítmo de Bresenham (versão que usa números inteiros)
 * @note https://github.com/ssloy/tinyrenderer/wiki/Lesson-1:-Bresenham%E2%80%99s-Line-Drawing-Algorithm
 * 
 * 
 * @param {ImageData} imageData 
 * @param {number} x0 
 * @param {number} y0 
 * @param {number} x1 
 * @param {number} y1 
 * 
 * @returns {void}
 */
export default function drawLine(imageData, x0, y0, x1, y1) {
    // Converte todas as coordenadas para números inteiros
    x0 |= 0;
    y0 |= 0;
    x1 |= 0;
    y1 |= 0;
  
    // obtém o array binários de cores dos pixels
    const data = imageData.data;

    const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
  
    if (steep) {
        let tmp;
        tmp = x0; x0 = y0; y0 = tmp;
        tmp = x1; x1 = y1; y1 = tmp;
    }
    
    if (x0 > x1) {
        let tmp;
        tmp = x0; x0 = x1; x1 = tmp;
        tmp = y0; y0 = y1; y1 = tmp;
    }
    
    const yStep = (y0 < y1) ? 1 : -1;
    
    const deltaX = x1 - x0;
    const deltaY = Math.abs(y1 - y0);
    let error = 0;
    
    let index = 0;
    let y = y0;
    
    for (let x = x0; x <= x1; x++) {
        // index is vertical coordinate times width, plus horizontal coordinate, 
        // times 4 because every pixel consists of 4 bytes
        if (steep) {
            index = (x * imageData.width + y) * 4; // y, x
        } else {
            index = (y * imageData.width + x) * 4; // x, y
        }

        // set RGBA values to 255 producing opaque white pixel
        data[index] = data[index + 1] = data[index + 2] = data[index + 3] = 255;

        error += deltaY;
        if ((error << 1) >= deltaX) {
            y += yStep;
            error -= deltaX;
        }
    }
}
