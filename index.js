const adjectives = [
    "Admirable", "Amazing", "Arresting", "Astonishing", "Awesome", 
    "Beautiful", "Breathtaking", "Brilliant", "Capital", "Captivating", 
    "Clever", "Commendable", "Delightful", "Distinguished", "Distinctive", 
    "Engaging", "Enjoyable", "Estimable", "Excellent", "Exceptional", 
    "Exemplary", "Exquisite", "Extraordinary", "Fabulous", "Fantastic", 
    "Fascinating", "Finest", "First-rate", "Flawless", "Glorious", 
    "Impressive", "Incomparable", "Incredible", "Inestimable", "Invaluable", 
    "Laudable", "Lovely", "Magnificient", "Marvelous", "Masterful", 
    "Miraculous", "Monumental", "Notable", "Noteworthy", "Outstanding", 
    "Overwhelming", "Perfect", "Phenomenal", "Priceless", "Refreshing", 
    "Remarkable", "Sensational", "Skillful", "Special", "Spectacular", 
    "Tremendous", "Unique", "Wonderful", "Stunning", "Old"
];

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const getRandomAdj = () => adjectives[getRandomInt(0, adjectives.length)];

const actions = {
    encrypt (str, key)
    {
        return str.split("")
                  .map(c => Number(c.charCodeAt() + key)
                  .toString(16)).join("") + Number(key).toString(16);
    },

    decrypt (str)
    {
        let key = parseInt(str.slice(-2), 16);
        str = str.slice(0, -2);
        let plaintext = "";
        for (let i = 0; i < str.length; i += 2) {
            let hex = str.slice(i, i + 2);
            plaintext += String.fromCharCode(parseInt(hex, 16) - key);
        }
        return plaintext;
    },

    addWatermark (plaintext) {
        return plaintext.split("\n").map(str => {
            if (str.match(/^\d+\)|^\d+\./g)) {
                let id = this.encrypt(`${getRandomAdj()} CSE-2`, getRandomInt(10, 90));
                return `${str}\nID: ${id}\n`;
            }
            return str;
        }).join("\n");
    },

    removeWatermark (waterMarkText) {
        return waterMarkText
               .split("\n").filter( str => str && !str.startsWith("ID:") )
               .join("\n");
    },

    decryptText (encodedText) {
        return encodedText.split("\n").map( this.decrypt.bind(this) ).join("\n");
    }
};

const app = document.querySelector(".app");
let input = document.createElement("textarea");
let output = document.createElement("div");
output.setAttribute("class", "output");

let select = document.createElement("select");
select.setAttribute("name", "action");
let encryptOption = document.createElement("option");
let decryptOption = document.createElement("option");
let removeOption = document.createElement("option");
encryptOption.setAttribute("value", "addWatermark");
decryptOption.setAttribute("value", "decryptText");
removeOption.setAttribute("value", "removeWatermark");
encryptOption.textContent = "Add";
decryptOption.textContent = "Decrypt";
removeOption.textContent = "Remove";
select.append( encryptOption, decryptOption, removeOption );

let convertButton = document.createElement("button");
convertButton.textContent = "Convert";
convertButton.addEventListener("click", (e) => {
    let outputStr = actions[select.value](input.value);
    output.textContent = outputStr.trim();
});

let div = document.createElement("div");
div.setAttribute("class", "buttons");
div.append(select, convertButton);

let copyAll = document.createElement("button");
copyAll.textContent = "Copy All";
copyAll.classList.add("copy-all");
copyAll.addEventListener("click", (e) => {
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
        if (result.state == "granted" || result.state == "prompt") {
            let text = output.textContent;
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    let oldText = copyAll.textContent;
                    copyAll.textContent = "COPIED!";
                    setTimeout(() => {
                        copyAll.textContent = oldText;
                    }, 2000);
                });
            }
        }
    });
});
copyAll.textContent = 'COPY ALL';

let outputContainer = document.createElement("div");
outputContainer.setAttribute("class", "output-container");
outputContainer.append(output, copyAll);

app.append(input, div, outputContainer);