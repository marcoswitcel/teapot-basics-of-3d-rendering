export default class DepthBuffer extends Uint16Array
{
    constructor(width, height)
    {
        super(width * height);
        
        this.width = width;
        this.height = height;
    }
    // add some properties and methods to make using this easier
    clear()
    {
        this.fill(65535);
    }

    getDepth(x, y)
    {
        return this[y * this.width + x] / 65535.0;
    }

    setDepth(x, y, v)
    {
        this[y * this.width + x] = (v * 65535) | 0;
    }

    testDepth(x, y, v)
    {
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
}