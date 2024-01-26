/**
 * Convert a letter of the text to uppercase.
 * @param {string} text 
 * @param {number} index 
 */
export function upperCaseLetter(text, index) {
    if (index >= text.length) return text
    let splitedText = text.split("")
    splitedText[index] = splitedText[index].toUpperCase()
    return splitedText.reduce((acum, next) => acum + next, "")
}