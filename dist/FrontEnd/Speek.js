"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.speek = void 0;
const speech = new SpeechSynthesisUtterance();
speech.rate = 2.5;
speech.onend = processNextSpeech;
const speechQueue = [];
let currentlyProcessing = false;
function processNextSpeech() {
    if (currentlyProcessing)
        return;
    if (speechQueue.length === 0) {
        currentlyProcessing = true;
        speech.text = speechQueue.shift();
        speechSynthesis.speak(speech);
    }
    else
        currentlyProcessing = false;
}
function speek(text) {
    speechQueue.push(text);
    processNextSpeech();
}
exports.speek = speek;
//# sourceMappingURL=Speek.js.map