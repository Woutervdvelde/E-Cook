/**
 * Draws a rectangle with rounded corners
 * @param {Number} x - first x coordinate
 * @param {Number} y - first y coordinate
 * @param {Number} x2 - second x coordinate
 * @param {Number} y2 - second y coordinate
 * @param {Bool|Color} fill - fill color, parse false for no fill
 * @param {Bool|Color} stroke - stroke color, parse false for no stroke
 * @param {Number} radius Amount of rounding on the corners
 */
CanvasRenderingContext2D.prototype.drawRoundRect = function (x, y, x2, y2, fill = false, stroke = true, radius = 5) {
    const cords = parseCords(x, y, x2, y2);
    this.beginPath();
    this.moveTo(cords.x + radius, cords.y);
    this.lineTo(cords.x + cords.x2 - radius, cords.y);
    this.quadraticCurveTo(cords.x + cords.x2, cords.y, cords.x + cords.x2, cords.y + radius);
    this.lineTo(cords.x + cords.x2, cords.y + cords.y2 - radius);
    this.quadraticCurveTo(cords.x + cords.x2, cords.y + cords.y2, cords.x + cords.x2 - radius, cords.y + cords.y2);
    this.lineTo(cords.x + radius, cords.y + cords.y2);
    this.quadraticCurveTo(cords.x, cords.y + cords.y2, cords.x, cords.y + cords.y2 - radius);
    this.lineTo(cords.x, cords.y + radius);
    this.quadraticCurveTo(cords.x, cords.y, cords.x + radius, cords.y);
    this.closePath();
    if (fill) {
        if (typeof fill != 'boolean')
            this.fillStyle = fill;
        this.fill();
    }
    if (stroke) {
        if (typeof stroke != 'boolean')
            this.strokeStyle = stroke;
        this.stroke();
    }
};

/**
 * Converts 2 x and y cordinates so the first x,y is top left and second x,y are bottom right.
 * @param {Number} x - first x coordinate
 * @param {Number} y - first y coordinate
 * @param {Number} x2 - second x coordinate
 * @param {Number} y2 - second y coordinate
 * @returns {{x,y,x2,y2}}
 */
const parseCords = (x, y, x2, y2) => {
    let cords = { x: x, y: y, x2: x2 - x, y2: y2 - y };
    if (x2 > x && y2 < y)
        cords = { x: x, y: y2, x2: x2 - x, y2: y - y2 };
    if (x2 < x && y2 > y)
        cords = { x: x2, y: y, x2: x - x2, y2: y2 - y };
    if (x2 < x && y2 < y)
        cords = { x: x2, y: y2, x2: x - x2, y2: y - y2 };
    return cords;
}

/**
 * Converts an HSL color value to HSLA for transparency.
 * @param {string} hsl - HSL value
 * @param {Number} alpha - alpha that needs to be applied
 * @return {string} - The HSLA representation
 */
function HSLtoHSLA(hsl, alpha) {
    if (!hsl) return;
    let [h, s, l] = hsl.match(/\d+/g);
    return `HSLA(${h}, ${s}%, ${l}%, ${alpha.toString()})`;
}

/**
 * Sets a timeout for a specific amount of time.
 * @param {Number} ms - Amount of time the timeout should be (in milliseconds)
 * @returns {Promise} - Resolves after specified amount of time
 */
const timeout = async ms => new Promise(res => setTimeout(res, ms));

/**
 * Enum class to easily create Enums  
 * Source: https://www.30secondsofcode.org/articles/s/javascript-enum
 * @example <caption>Example usage of Enum class</caption>
 * //returns an enum containing MEOW and BORK
 * const AnimalSounds = new Enum('MEOW', 'BORK');
 * AnimalSounds.MEOW //0
 * AnimalSounds.BORK //1
 */
class Enum {
    constructor(...keys) {
        keys.forEach((key, i) => {
            this[key] = i;
        });
        Object.freeze(this);
    }

    *[Symbol.iterator]() {
        for (let key of Object.keys(this)) yield key;
    }
}

/**
 * Method that returns the last element of the array.
 * @returns Last element in array
 */
Array.prototype.last = function() {
    return this[this.length - 1];
}
HTMLCollection.prototype.last = function() {
    return this[this.length - 1];
}