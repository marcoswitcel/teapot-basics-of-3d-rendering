export default class DepthBuffer extends Uint16Array {
    /**
     * 
     * @param {Number} width 
     * @param {Number} height 
     */
    constructor(width, height) {
        super(width * height);
        
        this.width = width;
        this.height = height;
    }

    /**
     * seta todos os pixeis para o valor máximo de um UInt16  ( 65535 )
     */
    clear() {
        this.fill(65535);
    }

    getDepth(x, y) {
        return this[y * this.width + x] / 65535.0;
    }

    setDepth(x, y, v)
    {
        this[y * this.width + x] = (v * 65535) | 0;
    }

    testDepth(x, y, v) {
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
    }
}