/**
 * A function to prettify float numbers in JavaScript.
 *
 * @param  {String} input Valid number input to be prettified.
 * @return {Number}       Prettified number output.
 */

export default function fixFloat(input) {
    return parseFloat(Number(input).toPrecision(9));
}
