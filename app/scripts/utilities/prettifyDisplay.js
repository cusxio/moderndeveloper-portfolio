/**
 * A function to prettify calculator display with nicer symbols.
 */

export default function prettifyDisplay(input, spaces) {
    const symbols = [
        {
            reg: /\*/g,
            dest: '×',
        }, {
            reg: /\//g,
            dest: '÷',
        }, {
            reg: /\-/g,
            dest: '−',
        }, {
            reg: /\+/g,
            dest: '+',
        },
    ];
    symbols.forEach((item) => {
        if (spaces) {
            input = input.replace(item.reg, ' ' + item.dest + ' ');
        } else {
            input = input.replace(item.reg, item.dest);
        }
    });
    return input;
}
