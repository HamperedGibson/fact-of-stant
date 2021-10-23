const fs = require("fs")

function generateMarkovArray(source, order) {
    let c = Math.max(order, 1);
    let markovArray = new Object;
    while (c < source.length) {
        let char = source[c]
        let prevChars = source.slice(c-order, c);
        if (markovArray[prevChars] == undefined) {
            markovArray[prevChars] = new Object;
            markovArray[prevChars][char] = 1;
        } 
        else {
            if (markovArray[prevChars][char] == undefined) { markovArray[prevChars][char] = 1; }
            else { markovArray[prevChars][char] += 1; }
        }
        c ++;
    }
    for (var given in markovArray) {
        let total = 0;
        for (const result in markovArray[given]) { total += markovArray[given][result]; }
        for (const result in markovArray[given]) { markovArray[given][result] = markovArray[given][result] / total; }
    }
    return markovArray;
}

function generateMarkovText(source, order, length) {
    let markovArray = generateMarkovArray(source, order);
    let str = getRandomStart(markovArray);

    while (str.length <= length) {
        let prevChars = str.slice(-order);
        let r = Math.random();
        let t = 0;
        let nextChar = null;
        for (const result in markovArray[prevChars]) {
            t += markovArray[prevChars][result];
            if (t > r) {
                nextChar = result;
                break;
            }
        }
        if (nextChar != null) { str += nextChar; }
        else { break; }
    }
    return str;
}

function getRandomStart(markovArray) {
    let givens = []
    for (const given in markovArray) { givens.push(given); }
    return givens[(Math.random()*givens.length) | 0]
}

console.log("Reading file: source.txt")
let s = fs.readFileSync("source.txt", 'utf8')
if (!s) {
    throw new Error("File not found")

}

let m = generateMarkovText(s, 2, 20000);
let word_regex = /(\s|;|\(|\)|,|\/|')+/
let words = m.split(word_regex)
let original_words = s.split(word_regex)
let dict = {}

for (const word of words) {
    let w = word.toLowerCase()
    if (Object.keys(dict).includes(w)) {
        dict[w] += 1
        continue
    }
    dict[w] = 1
}

for (const item of Object.keys(dict)) {
    if (!original_words.includes(item)) {
        console.log(item)
    }
}
